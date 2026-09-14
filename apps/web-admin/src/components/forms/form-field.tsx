import { Label } from '@/components/ui/label';
import { Input, InputProps } from '@/components/ui/input';

interface FormFieldProps extends InputProps {
    label: string;
    error?: string;
}

export function FormField({ label, error, id, ...inputProps }: FormFieldProps) {
    return (
        <div>
            <Label htmlFor={id}>{label}</Label>
            <Input id={id} {...inputProps} />
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>
    );
}