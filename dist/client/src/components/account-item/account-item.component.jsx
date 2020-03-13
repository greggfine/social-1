import React from "react"
import "../account/account.styles.scss"
import "./account-item.styles.scss"

const AccountItem = ({
  currUserSettingsFieldKey,
  currUserSettingsFieldValue,
  disabled,
  handleChange
}) => {
  return (
    <div className={`${currUserSettingsFieldKey} Account-Item`}>
      <label className="current-user-account-field" htmlFor={currUserSettingsFieldKey}>
        {currUserSettingsFieldKey}
      </label>
      <input
        id={{ currUserSettingsFieldKey }}
        type={
          currUserSettingsFieldKey === "email"
            ? "email"
            : currUserSettingsFieldKey === "website" ||
              currUserSettingsFieldKey === "socialMedia1" ||
              currUserSettingsFieldKey === "socialMedia2" ||
              currUserSettingsFieldKey === "socialMedia3"
            ? "url"
            : "text"
        }
        value={currUserSettingsFieldValue}
        onChange={handleChange}
        name={currUserSettingsFieldKey}
        required={currUserSettingsFieldKey === "memberName"}
        className="account-settings-input"
        tabIndex={-1}
        disabled={disabled}
        maxLength={49}
      />
    </div>
  )
}

export default AccountItem
