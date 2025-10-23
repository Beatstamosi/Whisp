import { useState, useRef, useEffect } from "react";
import { FiMoreVertical } from "react-icons/fi";
import useLogOut from "../Authentication/LogOut/LogOut";
import styles from "./DropDownMenu.module.css";
import { useNavigate } from "react-router-dom";

export default function DropdownMenu({ userId }: { userId: string }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const logOutHandler = useLogOut();
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className={styles.dropdownWrapper} ref={menuRef}>
      <button onClick={() => setOpen(!open)} className={styles.dropdownButton}>
        <FiMoreVertical size={20} color="#7c4dff" />
      </button>

      {open && (
        <div className={styles.dropdownMenu}>
          <button
            className={styles.dropdownItem}
            onClick={() => {
              navigate(`/edit-profile/${userId}`);
              setOpen(false);
            }}
          >
            Edit Profile
          </button>
          <button
            className={`${styles.dropdownItem} ${styles.logout}`}
            onClick={(e) => logOutHandler(e)}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
