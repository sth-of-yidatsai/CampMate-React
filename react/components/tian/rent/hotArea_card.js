import React from 'react'

import { useQuery } from '@/hooks/use-query'

export default function HotArea_card() {
  const { tag, setFilters, goToList, setLiveTag, addFiltersObjArr } = useQuery()

  const brandInfo = [
    {
      brand_id: '9',
      brand_name: 'Dometic 多美達',
      image: '/tian/hotArea/hotArea_Dometic.jpg',
    },
    {
      brand_id: '15',
      brand_name: 'KZM / KAZMI',
      image: '/tian/hotArea/hotArea_KAZMIKZM.jpg',
    },
  ]

  const goToBrand = () => {
    const tag_parent = 'brand'
    const tag_child = brandInfo[0].brand_name

    const tagObj = {
      brand: [tag_child],
      people: [],
      functional: [],
      material: [],
      price: [],
    }

    setLiveTag((prevLiveTag) => {
      const currentArray = prevLiveTag[tag_parent]

      if (currentArray.includes(tag_child)) {
        return {
          ...prevLiveTag,
          [tag_parent]: [
            ...prevLiveTag[tag_parent].filter((item) => item != tag_child),
          ],
        }
      } else {
        return {
          ...prevLiveTag,
          [tag_parent]: [...currentArray, tag_child],
        }
      }
    })

    addFiltersObjArr('tag', tagObj)
    goToList()
  }

  return (
    <>
      <div className="hotArea-tian">
        <div className="hotMain" onClick={goToBrand}>
          <div className="areaImg">
            <img src={`${brandInfo[0].image}`} alt="" />
          </div>
          <div className="hotInfo d-flex flex-column align-items-start">
            <p className="infoTitle p2-tc-tian light-text-tian m-0">
              {brandInfo[0].brand_name}
            </p>
            <div className="infoTag d-flex justify-content-start d-none">
              <span className="tag p3-tc-tian light-text-tian prompt-bg-tian">
                Dometic 多美達
              </span>
              <span className="tag p3-en-tian dark-text-tian success-bg-tian">
                Tent
              </span>
            </div>
          </div>
        </div>
        <div className="hotDev">
          <div className="hotLink" onClick={goToBrand}>
            <div className="linkBtn">
              <a className="material-symbols-outlined dark-text-tian">
                arrow_outward
              </a>
            </div>
            <div className="linkInfo">
              <div className=" light-text-tian p2-tc-tian mb-2">瀏覽更多</div>
              <div className="success-text-tian p3-tc-tian">
                {brandInfo[0].brand_name}
              </div>
            </div>
          </div>
          <div className="hotTitle d-flex justify-content-center align-items-center">
            <span className="light-text-tian h6-tc-tian">精選品牌</span>
          </div>
        </div>
      </div>
    </>
  )
}
