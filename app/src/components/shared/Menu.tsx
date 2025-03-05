import { useEffect, useRef, useState } from 'react';
import "./Menu.scss"

export default function Menu({components} : {components: JSX.Element[]}) {
    const [cmpView, setCmpView] = useState<number>(0)

    return(components.length == 3 ?
        <>
            <table className='menu'>
                <tr>
                    <td onClick={() => {setCmpView(0)}} className={'menu-data' + (cmpView == 0 ? "-active" : "")}>Deposit/Withdraw</td>
                    <td onClick={() => {setCmpView(1)}} className={'menu-data' + (cmpView == 1 ? "-active" : "")}>Bills</td>
                    <td onClick={() => {setCmpView(2)}} className={'menu-data' + (cmpView == 2 ? "-active" : "")}>Requests</td>
                </tr>
            </table>
            <div className="main-panel">
                {components.map((v, i) => {
                    if (cmpView == i) {
                        return v
                    }
                })}
            </div>
        </> : 
    <p>Error rendering menu!</p>)
}