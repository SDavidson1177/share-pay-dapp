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

export function FormTime({register, timeId, label} : {register: UseFormRegister<FieldValues>, timeId: string, label: string}) {
    return (<>
        <label>{label}:
            <input type="number" {...register(timeId + "_timeValue")}/>
        </label>
        <label>
            Unit:
            <select {...register(timeId + "_timeUnit")}>
                <option value={SECONDS}>seconds</option>
                <option value={MINUTES}>minutes</option>
                <option value={HOURS}>hours</option>
                <option value={DAYS}>days</option>
                <option value={WEEKS}>weeks</option>
            </select>
        </label>
    </>)
}