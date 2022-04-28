import { useState, useRef, useEffect } from 'react';
import styles from '../styles/Dropdown.module.css'
import {FiChevronDown, FiChevronUp} from 'react-icons/fi'

export default function Dropdown( props ) {
    const [display, setDisplay] = useState(false)
    const [state, setState] = useState(props.initialSelection)


    // Function to detect clicks outside of the element
    function useOutsideAlerter(ref) {
        useEffect(() => {
          function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) {
                setDisplay(false)
            }
          }
          // Bind the event listener
          document.addEventListener("mousedown", handleClickOutside);
          return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
          };
        }, [ref]);
      }

    const wrapperRef = useRef(null);
    useOutsideAlerter(wrapperRef);


    function handleClick() {
        setDisplay(!display)
    }

    // Calls the serverless function to update the corresponding field (ethnicity or gender)
    function submitForm(option) {
        // updates the cookie containing current user info
        props.cookieUpdate(option)
        fetch(`/api/${props.apiCall}`, {
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
        <div ref={wrapperRef} className={styles.main}>
            <p className={styles.label}>{props.title}</p>
            <div onClick={handleClick} className={styles.DropdownButton}>
                { state }  
                <div className={styles.arrow}>
                    {(display)? (<FiChevronUp></FiChevronUp>) : (<FiChevronDown></FiChevronDown>)}
                </div>              
            </div>
            {
                display &&
                <div>
                    <div className={styles.elementsContainer}>
                        {
                            props.options.map((option, index) => {
                                return (
                                <div className={styles.containerElement} key={index}
                                    option={option} onClick={() => {
                                        setState(option)
                                        handleClick()
                                        submitForm(option);
                                        }}>
                                    <p className={styles.text}>{option}</p>
                                </div>
                                )
                            })
                        }
                    </div>
                </div>
            }
        </div>
    )
}