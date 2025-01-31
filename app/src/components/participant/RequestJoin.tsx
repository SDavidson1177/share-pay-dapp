import { useRef } from 'react';
import { ethers } from 'ethers'
import { useForm } from 'react-hook-form';

export function RequestJoin({contract, signer, rerender} : {contract: ethers.Contract | undefined, signer: ethers.JsonRpcSigner | undefined, rerender: any}) {
    const {
        register,
        handleSubmit,
    } = useForm();

    const request_to_join = async (data: any) => {
        let tx = await contract?.requestToJoin(ethers.getAddress(data.owner), data.title)
        await tx.wait()
        rerender()
        console.log(tx)
    }

    return (<>
        <h3>Request to Join Bill</h3>
        <form onSubmit={handleSubmit(request_to_join)}>
            <label>
                Bill Name:
                <input type="text" {...register("title")}></input>
            </label><br></br>

            <label>
                Owner Address:
                <input type="text" {...register("owner")}></input>
            </label><br></br>

            <button type="submit">Request</button>
        </form>
    </>)
}