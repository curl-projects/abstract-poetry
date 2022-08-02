import discord from "../../../public/assets/discord.svg";
import slack from "../../../public/assets/slack.svg"
import { Tooltip } from "@mui/material";

export const SocialsBar = () => {
  return(
    <div className='socials-bar'>
      <Tooltip title="Join us on Discord!">
        <div className='socials-box'>
          <a href="https://discord.gg/X8PtGHkMQc" target="_blank">
            <button className="socials-button" type="submit" style={{ cursor: "pointer", paddingTop: '10px' }}>
              <img src={discord} alt="Discord Logo" />
            </button>
          </a>
        </div>
      </Tooltip>
      <Tooltip title="Join us on Slack!">
        <div className="socials-box">
          <a href="https://join.slack.com/t/curl-projects/shared_invite/zt-1dez98is7-Yxtu3GKvB4ae3RDG~9qF5g" target="_blank">
            <button className="socials-button" type="submit" style={{ cursor: "pointer", paddingTop: '10px' }}>
              <img src={slack} alt="Slack Logo" />
            </button>
          </a>
        </div>
      </Tooltip>
    </div>
  )
}
