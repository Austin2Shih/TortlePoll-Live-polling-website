import { useState, useRef, useEffect } from 'react';
import styles from '../styles/DropdownFilter.module.css'
import {FiChevronDown, FiChevronUp} from 'react-icons/fi'

export default function Dropdown( props ) {
    const [display, setDisplay] = useState(false)

    // Generates a boolean list corresponding to if each ethnicity is selected for filtering
    const [ethnicityState, setEthnicityStates] = useState(Array(props.ethnicities.length).fill(false))

    // Needs to be a react hook so that we can cause it to re-render
    const [ethnicityDisplay, setEthnicityDisplay] = useState(props.ethnicities.map((option, index) => {
        return (
        <div className={ethnicityState[index]? styles.selectedContainerElement : styles.containerElement} key={index}
            option={option} onClick={handleFilterE(index)}>
            <p className={styles.text}>{option}</p>
        </div>
        )
    }))

    // Same as above but for gender
    const [genderState, setGenderStates] = useState(Array(props.genders.length).fill(false))
    const [genderDisplay, setGenderDisplay] = useState(props.genders.map((option, index) => {
        return (
        <div className={genderState[index]? styles.selectedContainerElement : styles.containerElement} key={index}
            option={option} onClick={handleFilterG(index)}>
            <p className={styles.text}>{option}</p>
        </div>
        )
    }))

    // Checks if click outside dropdown menu happened and closes menu
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

    // Updates the filter for ethnicity (returns a function specific to the index)
    // index is a string holding the ethnicity that is either being filtered or unfiltered
    function handleFilterE(index) {
        return () => {
            // copy ethnicityState to temp to prevent overwriting of ethnicityState
            let temp = ethnicityState
            temp[index] = !temp[index]      // flip state of the ethnicity filter
            setEthnicityStates(temp)        // set state of ethnicity filter
            props.ethnicityUpdate(props.ethnicities[index], temp[index])    // update corresponding filter element in parent
            setEthnicityDisplay(props.ethnicities.map((option, index) => {  // re-render the dropdown to have the selected filters highlighted
                return (
                <div className={ethnicityState[index]? styles.selectedContainerElement : styles.containerElement} key={index}
                    option={option} onClick={handleFilterE(index)}>
                    <p className={styles.text}>{option}</p>
                </div>
                )}
            ))
        }
    }

    // Updates the filter for gender
    // index is a string holding the gender that is either being filtered or unfiltered
    function handleFilterG(index) {
        return () => {
            let temp = genderState
            temp[index] = !temp[index]
            setGenderStates(temp)
            props.genderUpdate(props.genders[index], temp[index])
            setGenderDisplay(props.genders.map((option, index) => {
                return (
                <div className={genderState[index]? styles.selectedContainerElement : styles.containerElement} key={index}
                    option={option} onClick={handleFilterG(index)}>
                    <p className={styles.text}>{option}</p>
                </div>
                )}
            ))
        }
    }

    return (
        <div ref={wrapperRef} className={styles.main}>
            <p className={styles.label}>{props.title}</p>
            <div onClick={handleClick} className={styles.DropdownButton}>
                <div className={styles.buttonText}>Select filters </div>
                <div className={styles.arrow}>
                    {(display)? (<FiChevronUp></FiChevronUp>) : (<FiChevronDown></FiChevronDown>)}
                </div>              
            </div>
            {
                display &&
                <div>
                    <div className={styles.elementsContainer}>
                        <div className={styles.optionLabel}><p className={styles.text}>Ethnicities</p></div>
                        { ethnicityDisplay }
                        <div className={styles.optionLabel}><p className={styles.text}>Genders</p></div>
                        { genderDisplay }
                    </div>
                </div>
            }
        </div>
    )
}