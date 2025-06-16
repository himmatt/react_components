import {useState} from "react";
import Radio from "../../components/Radio";
import { MultiSelect,type SelectOption} from "../../components/MultiSelect";
import { SingleSelect,type SelectOption1} from "../../components/SingleSelect";

const options = [
    { label: "America", value: "america" },
    { label: "Brazil", value: "brazil" },   
    { label: "Canada", value: "canada" },
    { label: "Denmark", value: "denmark" },
    { label: "Egypt", value: "egypt" },
    { label: "France", value: "france" },
    { label: "Germany", value: "germany" },
    { label: "Hungary", value: "hungary" },
    { label: "India", value: "india" },
    { label: "Japan", value: "japan" },
]

const HomePage = () => {
    const [value1, setValue1] = useState<SelectOption[]>([options[0]])
    const [value2, setValue2] = useState<SelectOption1 | null>(options[0])
    return (
        <div className="container mx-auto mt-20">
            <Radio
                isRequired
                label="Radio Input"
                options={[
                    { label: "One", value: "one" },
                    { label: "Two", value: "two" },
                ]}
                value={"two"}
                onChange={(value) => console.log(value)}
            />
           
            <MultiSelect
                isRequired
                label="Select Input with multiple options"
                multiple
                options={options}
                value={value1}
                onChange={(value) => setValue1(value)}
             
            />
            <SingleSelect
                isRequired
                label="Select Input with single option"
                options={options}
                value={value2}
                onChange={(value) => setValue2(value)}
            />
            <br />
           
            
            
        </div>
    );
};

export default HomePage;
