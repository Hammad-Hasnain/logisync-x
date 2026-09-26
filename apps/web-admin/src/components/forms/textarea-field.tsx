import { Label } from '@/components/ui/label';
import { Textarea, TextareaProps } from '@/components/ui/textarea';

interface TextareaFieldProps extends TextareaProps {
    label: string;
    error?: string;
    id: string;
}

export function TextareaField({ label, error, id, ...textareaProps }: TextareaFieldProps) {
    return (
        <div>
            <Label htmlFor={id}>{label}</Label>
            <Textarea id={id} {...textareaProps} />
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>
    );
}