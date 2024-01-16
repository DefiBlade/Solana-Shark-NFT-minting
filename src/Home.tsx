import { useEffect, useMemo, useState, useCallback } from "react";
import * as anchor from "@project-serum/anchor";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Container, Snackbar } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import Alert from "@material-ui/lab/Alert";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletDialogButton } from "@solana/wallet-adapter-material-ui";
import {
  awaitTransactionSignatureConfirmation,
  CandyMachineAccount,
  CANDY_MACHINE_PROGRAM,
  getCandyMachineState,
  mintOneToken,
} from "./candy-machine";
import { AlertState, toDate, formatNumber, getAtaForMint } from "./utils";
import { MintCountdown } from "./MintCountdown";
import { MintButton } from "./MintButton";
import { GatewayProvider } from "@civic/solana-gateway-react";
import MainPage from "./pages/Home";

import Dashboard from "./pages/Home/Dashboard/Dashboard";
import About from "./pages/Home/About/About";
import Perks from "./pages/Home/Perks/Perks";
import Roadmap from "./pages/Home/Roadmap/Roadmap";
import Partnership from "./pages/Home/Partnership/Partnership";
import Team from "./pages/Home/Team/Team";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";

import "./pages/Home/Dashboard/Dashboard.scss";
import ClueImage from "./assets/images/clue.png";
import DiscordImage from "./assets/images/discord.png";
import InstagramImage from "./assets/images/instagram.png";
import TwitterImage from "./assets/images/twitter.png";
import FacebookImage from "./assets/images/facebook.png";
import Shark3Image from "./assets/images/shark3.png";
import LeafImage from "./assets/images/leaf.png";

const ConnectButton = styled(WalletDialogButton)`
  width: 100%;
  height: 60px;
  margin-top: 10px;
  margin-bottom: 5px;
  background: linear-gradient(180deg, #604ae5 0%, #813eee 100%);
  color: white;
  font-size: 16px;
  font-weight: bold;
`;

const MintContainer = styled.div``; // add your owns styles here

export interface HomeProps {
  candyMachineId?: anchor.web3.PublicKey;
  connection: anchor.web3.Connection;
  txTimeout: number;
  rpcHost: string;
}

const Home = (props: HomeProps) => {
  const [isUserMinting, setIsUserMinting] = useState(false);
  const [candyMachine, setCandyMachine] = useState<CandyMachineAccount>();
  const [alertState, setAlertState] = useState<AlertState>({
    open: false,
    message: "",
    severity: undefined,
  });
  const [isActive, setIsActive] = useState(false);
  const [endDate, setEndDate] = useState<Date>();
  const [itemsRemaining, setItemsRemaining] = useState<number>();
  const [isWhitelistUser, setIsWhitelistUser] = useState(false);
  const [isPresale, setIsPresale] = useState(false);
  const [discountPrice, setDiscountPrice] = useState<anchor.BN>();

  const rpcUrl = props.rpcHost;
  const wallet = useWallet();

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
          await mintOneToken(candyMachine, wallet.publicKey)
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

  const toggleMintButton = () => {
    let active = !isActive || isPresale;

    if (active) {
      if (candyMachine!.state.isWhitelistOnly && !isWhitelistUser) {
        active = false;
      }
      if (endDate && Date.now() >= endDate.getTime()) {
        active = false;
      }
    }

    if (
      isPresale &&
      candyMachine!.state.goLiveDate &&
      candyMachine!.state.goLiveDate.toNumber() <= new Date().getTime() / 1000
    ) {
      setIsPresale((candyMachine!.state.isPresale = false));
    }

    setIsActive((candyMachine!.state.isActive = active));
  };

  useEffect(() => {
    refreshCandyMachineState();
  }, [
    anchorWallet,
    props.candyMachineId,
    props.connection,
    refreshCandyMachineState,
  ]);

  const calculateTimeLeft = () => {
    const presaleDate = new Date(Date.UTC(2022, 2, 3, 12, 0, 0));
    const difference = presaleDate.getTime() - new Date().getTime();
  
    let timeLeft = {};
  
    if (difference > 0) {
      timeLeft = {
        days:
          Math.floor(difference / (1000 * 60 * 60 * 24)) < 10
            ? `${Math.floor(difference / (1000 * 60 * 60 * 24))}`
            : `${Math.floor(difference / (1000 * 60 * 60 * 24))}`,
        hours:
          Math.floor((difference / (1000 * 60 * 60)) % 24) < 10
            ? `${Math.floor((difference / (1000 * 60 * 60)) % 24)}`
            : `${Math.floor((difference / (1000 * 60 * 60)) % 24)}`,
        minutes:
          Math.floor((difference / 1000 / 60) % 60) < 10
            ? `${Math.floor((difference / 1000 / 60) % 60)}`
            : `${Math.floor((difference / 1000 / 60) % 60)}`,
        seconds:
          Math.floor((difference / 1000) % 60) < 10
            ? `${Math.floor((difference / 1000) % 60)}`
            : `${Math.floor((difference / 1000) % 60)}`,
      };
    } else {
      timeLeft = {
        days : 0,
        hours : 0,
        minutes : 0,
        seconds: 0
      }
    }
  
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState<any>(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearTimeout(timer);
  }, [timeLeft]);

  const navigate = useNavigate();

  const gotoMint = () => {
    if (timeLeft.days < 2) {
      navigate("/mint");
    } else {
      setAlertState({
        open: true,
        message: "Pre-sale is not open. Please try it on March 1st at 8pm!",
        severity: "error",
      });
    }
  }

  return (
    <>
      <div className="dashboard">
        <div className="dashboard-container">
          <Header />
          <div className="dashboard-title-back-bottom">
            <div className="content">Shark</div>
          </div>
          <div className="dashboard-title-back">SURF</div>
          <div className="dashboard-content">
            <div className="dashboard-content-top-leaf">
              <img src={LeafImage} />
            </div>
            <div className="dashboard-mint-title">
              Salutations,
              <br />
              Surf <span className="dashboard-mint-highlight">Shark</span>
              <br />
              Society!
              <br />
            </div>
            {/* <div className="dashboard-mint-clue">
              <img src={ClueImage} />
            </div> */}
            <div className="dashboard-mint-control">
              <div
                className="dashboard-mint-button"
                onClick={() => gotoMint()}
              >
                Minting soon
              </div>
              <div className="dashboard-mint-caption">{timeLeft.days} Days {timeLeft.hours} Hrs {timeLeft.minutes} Mins</div>
            </div>
          </div>
          <div className="dashboard-socials">
            <div className="dashboard-socials-link">
              <a href="https://discord.gg/surfsharksociety">
                <img src={DiscordImage} />
              </a>
            </div>
            <div className="dashboard-socials-link">
              <a href="https://www.instagram.com/surfsharksociety">
                <img src={InstagramImage} />
              </a>
            </div>
            <div className="dashboard-socials-link">
              <a href="https://twitter.com/surfsharksoc">
                <img src={TwitterImage} />
              </a>
            </div>
            <div className="dashboard-socials-link">
              <a href="https://www.facebook.com/SURFSHARKSOCIETY">
                <img src={FacebookImage} />
              </a>
            </div>
            <div className="dashboard-socials-leaf">
              <img src={LeafImage} />
            </div>
          </div>
          <div className="dashboard-shark">
            <img src={Shark3Image} />
          </div>
        </div>
      </div>
      <About />
      <Perks />
      <Roadmap />
      <Partnership />
      <Team />
      <Footer />
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
    </>
  );
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

export default Home;
