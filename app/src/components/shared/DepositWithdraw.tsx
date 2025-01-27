import { useForm, UseFormHandleSubmit, FieldValues } from 'react-hook-form';
import { FormUnit } from './form';
import { ethers } from 'ethers'
import { Denominations, DenomMultiplier, Units} from '../shared/constants';

export function Deposit({contract, signer} : {contract: ethers.Contract | undefined, signer: ethers.JsonRpcSigner | undefined}) {
    const {
        register,
        handleSubmit,
      } = useForm();

    const deposit = async (data: any) => {
        let tx: ethers.ContractTransaction
        await contract?.deposit.populateTransaction().then((v) => {
        tx = v
        tx.value = ethers.parseUnits(data.amount.toString(), Units[data.unit])
        })

        await signer?.sendTransaction(tx!)
    }

    const balance = async () => {
        await contract?.balance().then((v) => {
          alert(v)
        })
      }

    return (<>
        <form onSubmit={handleSubmit(deposit)}>
            <label>
                Amount:
                <input type='number' {...register("amount")}></input>
            </label>
            <FormUnit register={register}></FormUnit><br></br>
            <button type='submit' style={{ padding: 10, margin: 10 }}>
                Deposit
            </button>
        </form>
        <button onClick={balance} style={{ padding: 10, margin: 10 }}>
            Balance
        </button>
    </>)
}