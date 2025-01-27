import { FieldValues, UseFormRegister } from 'react-hook-form';
import { Denominations, DenomMultiplier} from '../shared/constants';

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