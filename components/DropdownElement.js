import styles from '../styles/Dropdown.module.css'

export default function DropdownElement(props) {

    return (
        <div className={styles.DropdownElement} onClick={props.onClick}>
            { props.children }
        </div>

    )

}