import { useState } from 'react'
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar'
import Link from 'next/link'

export default function Aside({
  title = '商品分類',
  mainLabels = [{ title: '', icon: <></>, subLabel: [], subLink: [] }],
}) {
  return (
    <>
      <Sidebar className="sidebar">
        <Menu>
          <h2>{title}</h2>
          {mainLabels.map((main, i) => {
            const subLinks = main.subLink || []
            return (
              <SubMenu
                key={i}
                label={main.title}
                icon={main.icon}
                className="level1"
              >
                {main.subLabel.map((sub, j) => {
                  const link = subLinks[j] || '#' // 默认链接为 '#' 防止 undefined 错误
                  return (
                    <Link
                      key={j}
                      href={link}
                      style={{ textDecoration: 'none' }}
                    >
                      <MenuItem className="level2">{sub}</MenuItem>
                    </Link>
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
