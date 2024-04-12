import React, { useState, useEffect } from "react";
import Countdown from "react-countdown";
import { Link } from "react-router-dom";
import Modal from "../components/Modal";
import Footer from "../components/Footer";
import { AddIcon } from "../assets";
import HorizontalSlider from "../components/HorizontalSlider";
import { PER_DOLLAR_PRICE, PER_USDT_TO_BNB } from "../contracts/contract";
import useContract from "../hooks/useContracts";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";
import ClipLoader from "react-spinners/ClipLoader";
import { toast } from "react-toastify";
import ImgDog from "../assets/logo-website.png";
import Logo from "../assets/logo-website.png";
import LogoFlare from "../assets/flare-network-launches.png";
import LogoFlare1 from "../assets/flare-logo.png";

const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

const Main = () => {
  const [open, setOpen] = useState(false);
  const [paymentType, setPaymentType] = useState("");
  const [payAmount, setPayAmount] = useState(0);
  const [receivedAmount, setReceivedAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  let [color, setColor] = useState("#ffffff");
  const [state, setState] = useState(null);
  const [price, setPrice] = useState(0);
  const [min, setMin] = useState(0);
  const [referral, setReferral] = useState(null);
  const [total, setTotal] = useState(0);
  const [sold, setSold] = useState(0);

  const [myRef, setMyRef] = useState(null);
  const [copy, setCopy] = useState(false);

  const { address, chainId, isConnected } = useWeb3ModalAccount();
  const [stat, setStat] = useState({});

  const { buy, getData, getStage } = useContract();

  // make my ref with address + url
  useEffect(() => {
    if (address) {
      setReferral(`${window.location.origin}/?ref=${address}`);
    }
  }, [address]);

  useEffect(() => {
    // get the referral from the url of no referral then set it to null
    const urlParams = new URLSearchParams(window.location.search);
    const ref = urlParams.get("ref");
    if (ref) {
      console.log(ref);
      setMyRef(ref);
    }
  }, []);

  useEffect(() => {
    const _getData = async () => {
      const _stage = await getStage();
      setMin(_stage.min);
      setState(_stage.state);
      setPrice(_stage.price);
      setTotal(_stage.stageLimit);
      setSold(_stage.totalSold);
    };
    if (isConnected) {
      _getData();
    }
  }, [isConnected]);

  const handleCopyRef = () => {
    navigator.clipboard.writeText(referral);
    setCopy(true);
  };

  const handlePayAmountChange = (e) => {
    console.log(e.target.value);
    if (Number(e.target.value) <= 0 || e.target.value === "") {
      setPayAmount(null);
      setReceivedAmount(0);
      return;
    }
    // set based on the payment type
    setPayAmount(Number(e.target.value));
    setReceivedAmount(Number(e.target.value * price));
  };

  const handleBuy = async () => {
    if (payAmount < min) {
      toast.error(`Pay amount must be larger than ${min}`);
    }
    setLoading(true);
    try {
      await buy(payAmount, myRef);
      toast.success("Successfully bought");
    } catch (e) {
      toast.error("Error in Buying");
      console.log(e.message);
    }
    setLoading(false);
    window.location.reload();
  };

  return (
    <div className="landing-page flex flex-col">
      <div className="page-content flex flex-col s-50">
        <div className="hero-sec flex">
          <div className="bg"></div>
          <div className="wrap wrapWidth flex">
            <div className="_block flex">
              <div className="left-side flex flex-col">
                <div className="slogan">
                  <div
                    className="tag1"
                    style={{ color: "rgba(251, 163, 0, 0.7019607843)" }}
                  >
                    <span className="logo-font">Shiba Blast</span> PRE-SALE, BUY
                    NOW
                  </div>
                </div>
                <div className="page-desc">
                  <span className="logo-font">Shiba Blast</span> Flare's newest meme coin that plans to take over the scene with an approach to marketing that will lead to exponential growth. It's the first meme that allows early adopters to earn with their own referral link which you can create here and receive 10% commission in FLR instantly everytime someone buys $BLAST. You can buy directly using FLR or USDT already in your wallet, if not please then you'll need to deposit some first to do so. Once purchased you will need to add the token to your wallet using the custom token, or import token option, in your wallet and add the following contract address below:
                </div>
                <div className="token-box flex items-center">
                  <div className="token-id">
                  0xBA3495e43199AD4EB653Be255172f921D4e44Ab5{" "}
                  </div>
                </div>
                <div className="page-desc">
                  Full instructions are below. To get started hit the connect wallet button to buy.
                </div>
                <div className="left-info flex">
                  <div className="info-le flex flex-col">
                    <div className="token-price">
                      1 FLR = 4.07 <span className="logo-font">Blast</span>
                    </div>
                    <div className="token-price">
                      PHASE 1 - 5,000,000
                    </div>
                    <div className="token-numb-sec flex aic">
                      <div className="numb">{stat.contractBalance}</div>
                      <div className="lbl">Shiba blast REMAINING</div>
                    </div>
                  </div>
                </div>
                <>
                  <HorizontalSlider value={sold} max={total} />
                </>
              </div>
              <div className="right-side flex flex-col">
                <div className="right-side-box flex flex-col">
                  <div className="box-tag">EXCHANGE</div>
                  <div className="box-desc">Please select a currency</div>
                  <div className="exchange-box flex flex-col">
                    <div className="currency-box flex flex-col">
                      <div className="currency-types flex items-center">
                        <div className="c-left flex">
                          <div className="token-items flex aic">
                            <div className="token-info flex aic gap-3">
                              <div className="w-[120px]">
                                <img src={LogoFlare} className="w-full" />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="c-right flex justify-end">
                          <div className="field flex flex-col">
                            <div className="field-lbl">AMOUNT</div>
                            <input
                              type="number"
                              className="txt cleanbtn"
                              placeholder="AMOUNT"
                              value={payAmount}
                              onChange={handlePayAmountChange}
                              // value="000"
                              style={{
                                color: "black",
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="currency-types flex items-center">
                        <div className="c-left flex">
                          <div className="token-items flex aic">
                            <div className="our-token flex aic">
                              <img src={Logo} className="logo" />
                              <div className="our-token-lbl">Blast </div>
                            </div>
                          </div>
                        </div>
                        <div className="c-right flex justify-end">
                          <div className="field flex flex-col">
                            <div className="field-lbl">RECIEVED</div>
                            <input
                              type="number"
                              className="txt cleanbtn"
                              placeholder="RECIEVED"
                              value={receivedAmount}
                              style={{
                                color: "black",
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="btn button" onClick={handleBuy}>
                    {loading ? (
                      <ClipLoader
                        color={color}
                        loading={loading}
                        cssOverride={override}
                        size={30}
                        aria-label="Loading Spinner"
                        data-testid="loader"
                      />
                    ) : (
                      "CONVERT NOW"
                    )}
                  </div>
                </div>

                <div className="info-box flex flex-col">
                  <p className="text-xl text-center py-2">
                    10% commission for each referred buyer!
                  </p>
                  <p className="text-sm text-center pb-2">
                    share the referral link and get 10% commission credited
                    directly to your wallet in $
                  </p>
                  <input
                    type="text"
                    placeholder="referral"
                    value={referral}
                    className="w-[90%] mx-auto btn-referral placeholder:text-White mb-2"
                  />
                  <button
                    className="text-xl bg-[rgba(251, 163, 0, 0.7019607843)] btn-referral w-[90%] mx-auto"
                    onClick={handleCopyRef}
                  >
                    {copy ? "Copied" : "Copy"}
                  </button>
                </div>
              </div>
              <div className="img flex">
                <img src={ImgDog} className="dog-img" />
              </div>
            </div>
          </div>
        </div>
        <div className="page-meta wrapWidth flex flex-col">
          <div id="howBuy" className="how-buy-sec flex flex-col">
            <div className="slogan flex aic jc">
              <div className="tag1">HOW TO BUY</div>
              <div className="logo-font ml-4">Shiba Blast</div>
            </div>
            <div className="how-buy-info flex">
              <div className="how-buy-left flex">
                <div className="steps flex flex-col">
                  <div className="step-tag">STEP 1 - CONNECT WALLET</div>
                  <div className="step-dec">
                    To begin, you will need to connect your wallet. Make sure you have
                    a MetaMask or Bifrost. You can then buy $BLAST with $FLR and receive the token immediately in
                    your wallet. Listing on the DEX is scheduled for the day after the presale ends.
                  </div>
                  <br />
                  {/* <div className="step-dec">
                    Purchasing on a desktop browser will give you a smoother
                    purchasing experience. For this, we recommend Metamask,
                    Binance Smart Chain, or Wallet Connect, and if using Meta
                    Mask make sure you select the Binance Smart Chain network.
                    If you are purchasing on mobile, we recommend using Trust
                    Wallet and connecting through the in-built browser (just
                    copy{" "}
                    <a
                      href="http://barkleys.io/"
                      target="_blank"
                      className="mx-3 underline"
                      rel="noreferrer"
                    >
                      Shiba blast
                    </a>{" "}
                    into the Trust Wallet Browser)
                  </div> */}
                </div>
              </div>
              <div className="how-buy-right flex aic jc">
                <img src="./images/bg-2.jpg" className="img" />
              </div>
            </div>
            <div className="how-buy-info flex flex-col mt-16">
              {/* <div className="how-buy-left flex">
                <div className="steps flex flex-col">
                  <div className="step-tag">STEP 2 - BUY Shiba Blast</div>
                  <br />
                  <div className="step-dec">
                    Once you have selected your preferred wallet provider click
                    “Connect Wallet” and select the appropriate option. For the
                    mobile wallet app, you will need to select “Wallet Connect”.
                  </div>
                  <br />
                  <div className="step-dec">
                    You will then have 3 options which you can by{" "}
                    <span className="logo-font">Shiba Blast</span>
                  </div>
                </div>
              </div> */}
              <div className="max-w-[600px] w-full mx-auto mt-10">
                <div className="card flex flex-col p-3">
                  <div className="text-center text-3xl font-semibold text-[#fba300c3]">
                    Buy With Flare Networks
                  </div>
                  <img src={LogoFlare} className="w-[200px] mx-auto py-3" />
                  <div className="card-desc text-center">
                    Please ensure you have Flare or USDT
                    available in your wallet before commencing the transaction. Type in the amount
                    of Flare you wish to use for the purchase, it will then show
                    the Shiba Blast you will receive in the box below then Click
                    “Convert Flare. You will then be asked to approve the
                    purchase. Please ensure you go through the approval step in
                    order to complete the transaction.
                  </div>
                </div>
              </div>
            </div>
            <div className="how-buy-info flex flex-col mt-16">
              <div className="how-buy-left flex">
                <div className="steps flex flex-col">
                  <div className="step-tag">
                    STEP 2 - ADD BLAST TOKEN TO YOUR WALLET
                  </div>
                  <br />
                  <div className="step-dec">
                    Once you have purchased your{" "}
                    <span className="logo-font">Shiba Blast</span> you will then
                    need to add the token information to your wallet so they are
                    visible. To do this do the following.
                  </div>
                  <br />
                  <div className="step-dec">
                    1. Go to your wallet that you connected to buy your{" "}
                    <span className="logo-font">Shiba Blast</span> and login
                  </div>
                  <div className="step-dec">
                    2. Once logged in, you will need to add the token,
                      depending on the wallet you used you will need to find the section that allows you to import a token
                      (metamask). Example screens below:

                  </div>
                  <div className="step-dec">
                    3. Once you have found the screen all you need to do is copy
                    and paste the contract address which is :
                    <span className="token-id b6 s-30">
                      0xBA3495e43199AD4EB653Be255172f921D4e44Ab5
                    </span>{" "}
                    in the contract address field then click the add token
                    button. Once done your token will appear in your wallet.
                  </div>
                </div>
              </div>
              <div className="images-block flex items-start justify-center">
                <div className="token-types-block2">
                  <div className="card flex flex-col">
                    <div className="card-tag">META MASK</div>
                    <img src="./images/tab1.png" className="tab-img" />
                  </div>
                  <div className="card flex flex-col">
                    <div className="card-tag">BSC</div>
                    <img src="./images/tab2.jpg" className="tab-img" />
                  </div>
                  <div className="card flex flex-col">
                    <div className="card-tag">TRUST WALLET</div>
                    <img src="./images/tab3.jpeg" className="tab-img" />
                  </div>
                </div>
              </div>
            </div>
            <div className="how-buy-info flex flex-col mt-16">
              <div className="how-buy-left flex">
                <div className="steps flex flex-col">
                  <div className="step-tag">
                    Shiba Blast CONTRACT INFORMATION
                  </div>
                  <br />
                  <div className="step-dec">
                    Use the contract information below to add the shiba blast
                    token to your wallet.
                  </div>
                  <br />
                  <div className="step-dec">
                    Address:
                    <a
                      href="https://flarescan.com/token/0xBA3495e43199AD4EB653Be255172f921D4e44Ab5"
                      className="token-id mx-3 underline"
                    >
                      {" "}
                      0xBA3495e43199AD4EB653Be255172f921D4e44Ab5
                    </a>
                  </div>
                  <div className="step-dec">Decimals: 18</div>
                  <div className="step-dec">Token symbol: Blast</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
      <Modal open={open} onClose={() => setOpen(false)}>
        {/* <SelectToken setOpen={setOpen} setSelectedToken={setSelectedToken} /> */}
      </Modal>
    </div>
  );
};

export default Main;
