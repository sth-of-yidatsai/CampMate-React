import { useState } from 'react'
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar'

export default function Aside({
  mainLabels = [{ title: '', icon: <></>, subLabel: [] }],
}) {
  return (
    <>
      <Sidebar className="sidebar">
        <Menu>
          <h2>會員中心</h2>
          {mainLabels.map((main, i) => {
            return (
              <SubMenu
                key={i}
                label={main.title}
                icon={main.icon}
                className="level1"
              >
                {main.subLabel.map((sub, i) => {
                  return (
                    <MenuItem key={i} className="level2">
                      {sub}
                    </MenuItem>
                  )
                })}
              </SubMenu>
            )
          })}
        </Menu>
      </Sidebar>
    </>
  )
}
