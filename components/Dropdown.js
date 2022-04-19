import { useState } from 'react';
import DropdownElement from '../components/DropdownElement.js';
import styles from '../styles/Dropdown.module.css'


export default function Dropdown( props ) {
    const [display, setDisplay] = useState('none')
    const [state, setState] = useState("--")

    function handleClick() {
        if(display == 'none') {
            setDisplay('block')
        } else {
            setDisplay('none')
        }
    }

    function submitForm(option) {
        fetch(`/api/update_ethnicity`, {
            method: 'POST',
            body: JSON.stringify({
                "user" : props.user,
                "state" : option
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
    }

    return (

        <div>
            <div onClick={handleClick} className={styles.DropdownButton}>
                { state }
            </div>
            <div style={{display: display}}>
            {
                props.options.map((option, index) => {
                    return (
                    <div>
                        <DropdownElement key={index} option={option} onClick={() => {
                            setState(option)
                            handleClick()
                            submitForm(option);
                            }
                        }>
                        <p>
                            {option}
                        </p>
                        </DropdownElement>
                    </div>
                    )
                })
            }
            </div>
            
        </div>

    )

}