'use strict';

import '../public/popup.css';
import '../public/base.css';
import {Router} from "./router";
import {AlphaWallet} from "./wallet/alphaWallet";

(function () {
  const wallet = new AlphaWallet()
  const router = new Router(wallet)


  function setupHeader() {
    // const walletName = document.getElementById("wallet_name")
    const walletAddr = document.getElementById("wallet_addr")
    const walletSwapper = document.getElementById("wallet_swap")
    const connectionStatus = document.getElementById("connection_status")

    walletAddr.addEventListener("click", (e) => {
      navigator.clipboard.writeText(e.target.dataset.addr).then(function () {
      }, function (err) {
        console.error('Could not copy text: ', err);
      });
    })

    walletSwapper.addEventListener("click", (e) => {
      router.navigateTo("wallets/swap")
    })
  }

  function beforeMount() {
    setupHeader()

    router.bind(document)

    mounted() //Call next step
  }

  function mounted() {
    if (window.alphaNav)
      router.onNavigate(window.alphaNav.path, window.alphaNav.data)
    else
      router.onNavigate("login_pin")
  }

  document.addEventListener('DOMContentLoaded', beforeMount);
})();
