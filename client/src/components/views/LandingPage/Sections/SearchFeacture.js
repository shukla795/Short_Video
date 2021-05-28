import React , {useState} from 'react';
import { Input } from 'antd';
const {Search} = Input;

function SearchFeacture(props){
     const [searchTerms,setSearchTerms] = useState("");
    const onChangeSearch = (event) => {
        setSearchTerms(event.currentTarget.value)

          props.refreshFunction(event.currentTarget.value);
    }
    return(
           <div>
            < Search
               value={searchTerms}
               onChange = {onChangeSearch}
               placeholder = "Search By Typing..."
                />
            </div>
    )
}

export default SearchFeacture