import style from "./EditProfile.module.css";
import { useAuth } from "../Authentication/useAuth";
import fallBackProfileImg from "../../assets/fallback_profile_img.png";
import { PiUploadSimple } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function EditProfile() {
  const { user } = useAuth();
  const [bio, setBio] = useState<string>(user?.bio ?? "Hi, I am using Whisp!");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSaveProfile = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const formData = new FormData();

    if (selectedFile) {
      formData.append("profile_picture", selectedFile);
    }

    formData.append("bio", bio);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/user/update`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          credentials: "include",
          body: formData,
        }
      );

      if (res.ok) {
        navigate(0);
      }
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  return (
    <div className={style.editProfileWrapper}>
      <h2 className={style.greeting}>
        Hi {user?.firstname} {user?.lastname}!
      </h2>

      {/* Profile Picture */}
      <div className={style.containerProfileImg}>
        <div className={style.profileImgWrapper}>
          <img
            src={previewUrl || user?.profile_picture || fallBackProfileImg}
            alt="Profile-Preview"
          />
          <div className={style.iconUploadImg}>
            <input
              type="file"
              accept="image/*"
              id="profileUpload"
              onChange={handleFileChange}
            />
            <label htmlFor="profileUpload">
              <PiUploadSimple size={"1em"} color="white" />
            </label>
          </div>
        </div>
        <span className={style.uploadText}>Upload Profile Picture</span>
      </div>

      {/* Bio */}
      <div className={style.bioSection}>
        <label htmlFor="bio">Bio</label>
        <textarea
          name="bio"
          id="bio"
          defaultValue={bio}
          onChange={(e) => setBio(e.target.value)}
        />
      </div>

      {/* Action buttons */}
      <div className={style.actionButtons}>
        <button
          className={style.btnPrimary}
          onClick={(e) => handleSaveProfile(e)}
        >
          Save Profile
        </button>
        <button className={style.btnSecondary} onClick={() => navigate("/")}>
          Cancel
        </button>
      </div>
    </div>
  );
}

export default EditProfile;
