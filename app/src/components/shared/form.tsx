import { FieldValues, UseFormRegister } from 'react-hook-form';
import { Denominations, SECONDS, MINUTES, HOURS, DAYS, WEEKS} from '../shared/constants';

export function FormUnit({register} : {register: UseFormRegister<FieldValues>}) {
    return (
        <label>
            Unit:
            <select {...register("unit")}>
                <option value={Denominations.WEI}>wei</option>
                <option value={Denominations.GWEI}>gwei</option>
                <option value={Denominations.ETHER}>ether</option>
            </select>
        </label>
    )
}

export function FormTime({register} : {register: UseFormRegister<FieldValues>}) {
    return (<>
        <label>Payment Interval:
            <input type="number" {...register("timeValue")}/>
        </label>
        <label>
            Unit:
            <select {...register("timeUnit")}>
                <option value={SECONDS}>seconds</option>
                <option value={MINUTES}>minutes</option>
                <option value={HOURS}>hours</option>
                <option value={DAYS}>days</option>
                <option value={WEEKS}>weeks</option>
            </select>
        </label>
    </>)
}