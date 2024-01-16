import "./Mint.scss";
import { Link } from "react-router-dom";
import LogoImage from "../../../assets/images/logo.png";
import SharkImage from "../../../assets/images/shark3.png";
import LeafImage from "../../../assets/images/leaf.png";
import { WalletDialogButton } from "@solana/wallet-adapter-material-ui";
import { PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useMemo, useState, useCallback } from "react";
import * as anchor from "@project-serum/anchor";
import styled from "styled-components";
import Alert from "@material-ui/lab/Alert";
import { Container, Snackbar } from "@material-ui/core";
import {
  awaitTransactionSignatureConfirmation,
  CandyMachineAccount,
  CANDY_MACHINE_PROGRAM,
  getCandyMachineState,
  mintOneToken,
  mintMultipleToken,
} from "../../../candy-machine";
import { MintButton } from "./MintButton";
import { GatewayProvider } from "@civic/solana-gateway-react";

import {
  AlertState,
  toDate,
  formatNumber,
  getAtaForMint,
} from "../../../utils";

const ConnectButton = styled(WalletDialogButton)``;
const MintContainer = styled.div``; // add your owns styles here

export interface HomeProps {
  candyMachineId?: anchor.web3.PublicKey;
  connection: anchor.web3.Connection;
  txTimeout: number;
  rpcHost: string;
}

const calculateTimeLeft = () => {
  const presaleDate = new Date(Date.UTC(2022, 2, 3, 12, 0, 0));
  const difference = presaleDate.getTime() - new Date().getTime();

  let timeLeft = {};

  if (difference > 0) {
    timeLeft = {
      days:
        Math.floor(difference / (1000 * 60 * 60 * 24)) < 10
          ? `0${Math.floor(difference / (1000 * 60 * 60 * 24))}`
          : `${Math.floor(difference / (1000 * 60 * 60 * 24))}`,
      hours:
        Math.floor((difference / (1000 * 60 * 60)) % 24) < 10
          ? `0${Math.floor((difference / (1000 * 60 * 60)) % 24)}`
          : `${Math.floor((difference / (1000 * 60 * 60)) % 24)}`,
      minutes:
        Math.floor((difference / 1000 / 60) % 60) < 10
          ? `0${Math.floor((difference / 1000 / 60) % 60)}`
          : `${Math.floor((difference / 1000 / 60) % 60)}`,
      seconds:
        Math.floor((difference / 1000) % 60) < 10
          ? `0${Math.floor((difference / 1000) % 60)}`
          : `${Math.floor((difference / 1000) % 60)}`,
    };
  } else {
    timeLeft = {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };
  }

  return timeLeft;
};

const getCountdownDate = (
  candyMachine: CandyMachineAccount
): Date | undefined => {
  if (
    candyMachine.state.isActive &&
    candyMachine.state.endSettings?.endSettingType.date
  ) {
    return toDate(candyMachine.state.endSettings.number);
  }

  return toDate(
    candyMachine.state.goLiveDate
      ? candyMachine.state.goLiveDate
      : candyMachine.state.isPresale
      ? new anchor.BN(new Date().getTime() / 1000)
      : undefined
  );
};

const Mint = (props: HomeProps) => {
  const account = "0x97d661d1A1fA2B216eB6E8a3E159054Bf59202D1";
  const wallet = useWallet();

  const [isUserMinting, setIsUserMinting] = useState(false);
  const [candyMachine, setCandyMachine] = useState<CandyMachineAccount>();
  const [alertState, setAlertState] = useState<AlertState>({
    open: false,
    message: "",
    severity: undefined,
  });
  const [isActive, setIsActive] = useState(false);
  const [balance, setBalance] = useState(0);
  const [endDate, setEndDate] = useState<Date>();
  const [itemsRemaining, setItemsRemaining] = useState<number>();
  const [isWhitelistUser, setIsWhitelistUser] = useState(false);
  const [isPresale, setIsPresale] = useState(false);
  const [discountPrice, setDiscountPrice] = useState<anchor.BN>();

  const rpcUrl = props.rpcHost;

  const [timeLeft, setTimeLeft] = useState<any>(calculateTimeLeft());

  const anchorWallet = useMemo(() => {
    if (
      !wallet ||
      !wallet.publicKey ||
      !wallet.signAllTransactions ||
      !wallet.signTransaction
    ) {
      return;
    }

    return {
      publicKey: wallet.publicKey,
      signAllTransactions: wallet.signAllTransactions,
      signTransaction: wallet.signTransaction,
    } as anchor.Wallet;
  }, [wallet]);

  const refreshCandyMachineState = useCallback(async () => {
    if (!anchorWallet) {
      return;
    }

    if (props.candyMachineId) {
      try {
        const cndy = await getCandyMachineState(
          anchorWallet,
          props.candyMachineId,
          props.connection
        );
        let active =
          cndy?.state.goLiveDate?.toNumber() < new Date().getTime() / 1000;
        let presale = false;
        // whitelist mint?
        if (cndy?.state.whitelistMintSettings) {
          // is it a presale mint?
          if (
            cndy.state.whitelistMintSettings.presale &&
            (!cndy.state.goLiveDate ||
              cndy.state.goLiveDate.toNumber() > new Date().getTime() / 1000)
          ) {
            presale = true;
          }
          // is there a discount?
          if (cndy.state.whitelistMintSettings.discountPrice) {
            setDiscountPrice(cndy.state.whitelistMintSettings.discountPrice);
            if (presale) {
              setNormalPrice(
                cndy.state.whitelistMintSettings.discountPrice.toNumber() /
                  1000000000
              );
              setTotal(
                (cndy.state.whitelistMintSettings.discountPrice.toNumber() /
                  1000000000) *
                  number
              );
            }
          } else {
            setDiscountPrice(undefined);
            // when presale=false and discountPrice=null, mint is restricted
            // to whitelist users only
            if (!cndy.state.whitelistMintSettings.presale) {
              cndy.state.isWhitelistOnly = true;
            }
          }
          // retrieves the whitelist token
          const mint = new anchor.web3.PublicKey(
            cndy.state.whitelistMintSettings.mint
          );
          const token = (await getAtaForMint(mint, anchorWallet.publicKey))[0];

          try {
            const balance = await props.connection.getTokenAccountBalance(
              token
            );
            let valid = parseInt(balance.value.amount) > 0;
            // only whitelist the user if the balance > 0
            setIsWhitelistUser(valid);
            active = (presale && valid) || active;
          } catch (e) {
            setIsWhitelistUser(false);
            // no whitelist user, no mint
            if (cndy.state.isWhitelistOnly) {
              active = false;
            }
            console.log("There was a problem fetching whitelist token balance");
            console.log(e);
          }
        }
        // datetime to stop the mint?
        if (cndy?.state.endSettings?.endSettingType.date) {
          setEndDate(toDate(cndy.state.endSettings.number));
          if (
            cndy.state.endSettings.number.toNumber() <
            new Date().getTime() / 1000
          ) {
            active = false;
          }
        }
        // amount to stop the mint?
        if (cndy?.state.endSettings?.endSettingType.amount) {
          let limit = Math.min(
            cndy.state.endSettings.number.toNumber(),
            cndy.state.itemsAvailable
          );
          if (cndy.state.itemsRedeemed < limit) {
            setItemsRemaining(limit - cndy.state.itemsRedeemed);
          } else {
            setItemsRemaining(0);
            cndy.state.isSoldOut = true;
          }
        } else {
          setItemsRemaining(cndy.state.itemsRemaining);
        }

        if (cndy.state.isSoldOut) {
          active = false;
        }

        setIsActive((cndy.state.isActive = active));
        setIsPresale((cndy.state.isPresale = presale));
        setCandyMachine(cndy);

        let balance = await props.connection.getBalance(anchorWallet.publicKey);
        setBalance(Math.floor(balance / 1000000000));
      } catch (e) {
        console.log("There was a problem fetching Candy Machine state");
        console.log(e);
      }
    }
  }, [anchorWallet, props.candyMachineId, props.connection]);

  const onMint = async () => {
    try {
      setIsUserMinting(true);
      document.getElementById("#identity")?.click();
      if (wallet.connected && candyMachine?.program && wallet.publicKey) {
        const mintTxId = (
          await mintMultipleToken(candyMachine, wallet.publicKey, number)
        )[0];

        let status: any = { err: true };
        if (mintTxId) {
          status = await awaitTransactionSignatureConfirmation(
            mintTxId,
            props.txTimeout,
            props.connection,
            true
          );
        }

        if (status && !status.err) {
          // manual update since the refresh might not detect
          // the change immediately
          let remaining = itemsRemaining! - 1;
          setItemsRemaining(remaining);
          setIsActive((candyMachine.state.isActive = remaining > 0));
          candyMachine.state.isSoldOut = remaining === 0;
          setAlertState({
            open: true,
            message: "Congratulations! Mint succeeded!",
            severity: "success",
          });
        } else {
          setAlertState({
            open: true,
            message: "Mint failed! Please try again!",
            severity: "error",
          });
        }
      }
    } catch (error: any) {
      let message = error.msg || "Minting failed! Please try again!";
      if (!error.msg) {
        if (!error.message) {
          message = "Transaction Timeout! Please try again.";
        } else if (error.message.indexOf("0x137")) {
          message = `SOLD OUT!`;
        } else if (error.message.indexOf("0x135")) {
          message = `Insufficient funds to mint. Please fund your wallet.`;
        }
      } else {
        if (error.code === 311) {
          message = `SOLD OUT!`;
          window.location.reload();
        } else if (error.code === 312) {
          message = `Minting period hasn't started yet.`;
        }
      }

      setAlertState({
        open: true,
        message,
        severity: "error",
      });
      // updates the candy machine state to reflect the lastest
      // information on chain
      refreshCandyMachineState();
    } finally {
      setIsUserMinting(false);
    }
  };

  useEffect(() => {
    refreshCandyMachineState();
  }, [
    anchorWallet,
    props.candyMachineId,
    props.connection,
    refreshCandyMachineState,
  ]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearTimeout(timer);
  }, [timeLeft]);

  const [normalPrice, setNormalPrice] = useState(1.2);
  const [number, setNumber] = useState(1);
  const [max, setMax] = useState(5);
  const [total, setTotal] = useState(normalPrice);
  const actionMinus = () => {
    let index = number - 1;
    setNumber(index);
    setTotal(Math.round(index * normalPrice * 10) / 10);
  };

  const actionPlus = () => {
    let index = number + 1;
    setNumber(index);
    setTotal(Math.round(index * normalPrice * 10) / 10);
  };

  const actionMax = () => {
    setNumber(max);
    setTotal(Math.round(max * normalPrice * 10) / 10);
  };

  return (
    <div className="mint">
      <div className="mint-container">
        <div className="mint-header">
          <div className="mint-header-logo">
            <Link to="/">
              <img src={LogoImage} />
            </Link>
          </div>
          <div className="mint-header-account">
            <div className="mint-header-address">
              {wallet.connected && candyMachine?.program && wallet.publicKey
                ? String(wallet.publicKey).substring(0, 4) +
                  "..." +
                  String(wallet.publicKey).substring(39)
                : "Your Wallet"}
            </div>

            <ConnectButton className="mint-header-connect">
              Connect
            </ConnectButton>
          </div>
        </div>
        <div className="mint-main">
          <div className="mint-shark">
            <div className="mint-title-back">Mint</div>
            <div className="mint-shark-image">
              <img src={SharkImage} />
            </div>
            <div className="mint-shark-leaf">
              <img src={LeafImage} />
            </div>
          </div>
          <div className="mint-info">
            <div className="mint-info-panel">
              <div className="mint-info-title">Minting soon!</div>
              <div className="mint-info-date">
                <div className="mint-info-time">
                  <div className="mint-info-time-content">{timeLeft.days}</div>
                  <div className="mint-info-time-unit">Days</div>
                </div>
                <div className="mint-info-time">
                  <div className="mint-info-time-content">{timeLeft.hours}</div>
                  <div className="mint-info-time-unit">Hrs</div>
                </div>
                <div className="mint-info-time">
                  <div className="mint-info-time-content">
                    {timeLeft.minutes}
                  </div>
                  <div className="mint-info-time-unit">Mins</div>
                </div>
              </div>
              <div className="mint-info-data">
                <div className="mint-info-data-row">
                  <div className="mint-info-data-label">Balance</div>
                  <div className="mint-info-data-amount">{balance} Solana</div>
                </div>
                <div className="mint-info-data-row">
                  <div className="mint-info-data-label">Amount</div>
                  <div className="mint-info-data-amount">
                    <div
                      className="mint-info-data-amount-minus"
                      onClick={() => {
                        return number > 1 ? actionMinus() : null;
                      }}
                    >
                      {" "}
                      -
                    </div>
                    <span className="mint-info-data-amount-value">
                      {number}
                    </span>
                    <div
                      className="mint-info-data-amount-plus"
                      onClick={() => {
                        return number < max ? actionPlus() : null;
                      }}
                    >
                      {" "}
                      +
                    </div>
                    <span
                      className="mint-info-data-amount-max"
                      onClick={() => actionMax()}
                    >
                      MAX
                    </span>
                  </div>
                </div>
                <div className="mint-info-data-row">
                  <div className="mint-info-data-label">Total</div>
                  <div className="mint-info-data-amount">{total} Solana</div>
                </div>
              </div>
              <div className="mint-button-section">
                {!wallet.connected ? (
                  <></>
                ) : (
                  <>
                    {candyMachine?.state.isActive &&
                    candyMachine?.state.gatekeeper &&
                    wallet.publicKey &&
                    wallet.signTransaction ? (
                      <GatewayProvider
                        wallet={{
                          publicKey:
                            wallet.publicKey ||
                            new PublicKey(CANDY_MACHINE_PROGRAM),
                          //@ts-ignore
                          signTransaction: wallet.signTransaction,
                        }}
                        gatekeeperNetwork={
                          candyMachine?.state?.gatekeeper?.gatekeeperNetwork
                        }
                        clusterUrl={rpcUrl}
                        options={{ autoShowModal: false }}
                      >
                        <MintButton
                          candyMachine={candyMachine}
                          isMinting={isUserMinting}
                          onMint={onMint}
                          isActive={isActive || (isPresale && isWhitelistUser)}
                        />
                      </GatewayProvider>
                    ) : (
                      <MintButton
                        candyMachine={candyMachine}
                        isMinting={isUserMinting}
                        onMint={onMint}
                        isActive={isActive || (isPresale && isWhitelistUser)}
                      />
                    )}
                  </>
                )}
                <div className="mint-button-label">
                  Make sure your Wallet is connected
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Snackbar
        open={alertState.open}
        autoHideDuration={6000}
        onClose={() => setAlertState({ ...alertState, open: false })}
      >
        <Alert
          onClose={() => setAlertState({ ...alertState, open: false })}
          severity={alertState.severity}
        >
          {alertState.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Mint;
