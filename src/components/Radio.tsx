import { useState } from "react";

type RadioPropsType = {
    isRequired?: boolean;
    label: string;
    options: { label: string; value: string }[];
    value: string;
    onChange: (value: string) => void;
    errorMessage?: string;
    styles?: any;
};

const Radio = ({
    isRequired = false,
    label,
    options,
    value,
    onChange,
    errorMessage = "",
    styles = {
        wrapper: "p-4 2xl:p-6 border rounded-md flex flex-wrap items-center gap-4 2xl:gap-x-6 2xl:gap-y-4",
        label: "mb-1 text-sm",
        input: "py-1 px-3 rounded-full border flex items-center gap-2 cursor-pointer",
        active: "",
        inactive: "",
        radioLabel: "text-sm",
        radioIndicator: "w-2 h-2 2xl:w-4 2xl:h-4 rounded-full border 2xl:border-2 flex items-center justify-center",
        radioIndicatorActive: "w-[5px] h-[5px] 2xl:w-2 2xl:h-2 rounded-full bg-primary",
        errorMessage: "text-red-600",
    },
}: RadioPropsType) => {
    const [selectedValue, setSelectedValue] = useState<string>(value);

    return (
        <div>
            <p className={`${errorMessage && styles.errorMessage} ${styles.label}`}>
                <span className="mb-1 mr-1">{label}</span>
                <span className={`${isRequired ? "text-red-600" : ""}`}>{isRequired ? "Required" : "Optional"}</span>
            </p>
            <div className={`${styles.wrapper} ${errorMessage ? "border-red-600" : ""}`}>
                {options?.map((option, index) => (
                    <button
                        type="button"
                        key={index}
                        onClick={() => {
                            onChange(option.value);
                            setSelectedValue(option.value);
                        }}
                        className={`${styles.input} ${selectedValue === option?.value ? "border-primary text-primary" : ""}`}
                    >
                        {selectedValue === option?.value ? (
                            <span className={`${styles.radioIndicator} border-primary `}>
                                <span className={`${styles.radioIndicatorActive}`} />
                            </span>
                        ) : (
                            <span className={`${styles.radioIndicator} border-default`} />
                        )}
                        <span className={styles.radioLabel}>{option?.label}</span>
                    </button>
                ))}
            </div>
            {errorMessage ? <p className={styles.errorMessage}>{errorMessage}</p> : null}
        </div>
    );
};

export default Radio;
