import { useState, useRef, useEffect } from 'react';
import styles from '../styles/DropdownFilter.module.css'
import {FiChevronDown, FiChevronUp} from 'react-icons/fi'

export default function Dropdown( props ) {
    const [display, setDisplay] = useState(false)
    const [ethnicityState, setEthnicityStates] = useState(Array(props.ethnicities.length).fill(false))
    const [ethnicityDisplay, setEthnicityDisplay] = useState(props.ethnicities.map((option, index) => {
        return (
        <div className={ethnicityState[index]? styles.selectedContainerElement : styles.containerElement} key={index}
            option={option} onClick={handleFilterE(index)}>
            <p className={styles.text}>{option}</p>
        </div>
        )
    }))

    const [genderState, setGenderStates] = useState(Array(props.genders.length).fill(false))
    const [genderDisplay, setGenderDisplay] = useState(props.genders.map((option, index) => {
        return (
        <div className={genderState[index]? styles.selectedContainerElement : styles.containerElement} key={index}
            option={option} onClick={handleFilterG(index)}>
            <p className={styles.text}>{option}</p>
        </div>
        )
    }))

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

    function handleFilterE(index) {
        return () => {
            let temp = ethnicityState
            temp[index] = !temp[index]
            setEthnicityStates(temp)
            props.ethnicityUpdate(props.ethnicities[index], temp[index])
            setEthnicityDisplay(props.ethnicities.map((option, index) => {
                return (
                <div className={ethnicityState[index]? styles.selectedContainerElement : styles.containerElement} key={index}
                    option={option} onClick={handleFilterE(index)}>
                    <p className={styles.text}>{option}</p>
                </div>
                )}
            ))
        }
    }

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
                Select filters 
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