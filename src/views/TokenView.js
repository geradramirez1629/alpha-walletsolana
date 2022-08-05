import AbstractView from "../view.js";
import {TOKEN_MGR} from "../managers/tokens/tokenManager";
import {TokenCard} from "../components/tokens/TokenCard";
import {PRICE_MANAGER} from "../managers/pricing/priceManager";

export default class TokenView extends AbstractView {

  tokenPrices = {}

  async getHtml() {
    const walletName = await this.getWallet().getStore().getPlain("wallet_name").catch(e => {
    })

    this.tokenPrices = await this.getManager(PRICE_MANAGER).getPrices()
    const mgr = this.getManager(TOKEN_MGR)
    const tokens = await mgr.getTokens()

    let totalPrice = 0
    let tokenViews = ""

    const sorted = Object.values(tokens.liquid).sort((a,b) => {
      return (b.amount.uiAmount * (this.tokenPrices[b.mint] || 0)) - (a.amount.uiAmount * (this.tokenPrices[a.mint] || 0))
    })

    for (let i = 0; i < sorted.length; i++) {
      totalPrice += (sorted[i].amount.uiAmount * (this.tokenPrices[sorted[i].mint] || 0))
      tokenViews += await this.addSubView(TokenCard, {
        token: sorted[i],
        price: this.tokenPrices[sorted[i].mint]
      }).getHtml()
    }

    let h = `
    <h5 class="text-start mb-3">Welcome Back, ${walletName}!</h5>

    <h1 class="mb-3">${totalPrice.toLocaleString("en-US", {
      style: 'currency',
      currency: "USD"
    })}</h1>

    <div class="row mt-3 mb-3">
      <div class="col-6">
        <button data-link="transfer/deposit" class="btn btn-primary btn-block">Deposit</button>
      </div>
      <div class="col-6">
        <button data-link="transfer/send" class="btn btn-primary btn-block">Send</button>
      </div>
    </div>`


    if (tokens.liquid.length === 0)
      h += `
    <div class="token-container">
      <i class="small">No Token Assets Detected</i>
    </div>`
    else {
      h += tokenViews
    }


    return h;
  }


  async onMounted(app) {
    super.onMounted(app);

    this.setTitle("Tokens");
    const elems = document.getElementsByClassName("token-card")
    for (let i = 0; i < elems.length; i++) {
      elems[i].addEventListener("click", (e) => this.onClick(e))
    }
  }

  onClick(e) {
    console.log("Token click", e)
    this.getRouter().navigateTo("tokens/show", {mint: e.target.dataset.mint, price: this.tokenPrices[e.target.dataset.mint]})
  }
}
