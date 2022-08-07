import {AbstractManager} from "../abstractManager";

export const STORAGE_MGR = "storage_mgr"

export class StorageManager extends AbstractManager {
  _walletStore
  _keyStore

  constructor(walletStore, keyStore) {
    super();

    this._walletStore = walletStore
    this._keyStore = keyStore
  }

  id() {
    return STORAGE_MGR
  }

  getWalletStore() {
    return this._walletStore
  }

  async getKeyStore(passcode) {
    const ok = await this._keyStore.unlock(passcode)
    if (!ok)
      throw new Error("invalid passcode")

    return this._keyStore
  }


  /**
   * Unlock the storage for a period of time
   *
   * @param passcode
   * @param lockTimeout
   * @returns {Promise<boolean>}
   */
  async unlock(passcode, lockTimeout) {
    const ok = await this.getWalletStore().testPasscode(passcode)
    if (!ok)
      return false

    console.log("Unlocking wallet storage for", lockTimeout)
    return await this.getWalletStore().unlock(passcode, lockTimeout)
  }
}
