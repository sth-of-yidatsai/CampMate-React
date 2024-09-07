import { useState, useEffect } from 'react'
import styles from './modal-join-event.module.scss'

import { useAuthTest } from '@/hooks/use-auth-test'

export default function ModalJoinEvent({ onClose, event_id }) {
  // 抓 Auth 裡面的 user 資料 ==> 這邊可以抓到 user 的 id
  const { auth, setAuth } = useAuthTest()
  // const { logoutFirebase } = useFirebase()
  const [userInfo, setUserInfo] = useState({})
  const getUserInfo = async () => {
    const url = `http://localhost:3005/api/users-test/${auth.userData.id}`
    try {
      const response = await fetch(url, {
        credentials: 'include',
      })
      const result = await response.json()

      if (result.status === 'success') {
        console.log(result.data.user)
        setUserInfo([result.data.user])
      } else {
        throw new Error(result.message)
      }
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    getUserInfo()
  }, [])

  // ------------------------------------

  // 報名表單，要手動填寫欄位的初始值
  const [formData, setFormData] = useState({
    emergency_contact_person: '',
    emergency_contact_phone: '',
    notes: '',
    health_status: '',
  })

  // ------------------------------------------

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  // 提交報名表單
  const handleSubmit = async (e) => {
    e.preventDefault()

    // 要傳送的完整資料，包含表單會員預設及手動填寫(formData)
    const completeFormData = {
      user_id: userInfo[0].id,
      event_id: event_id, // 使用從 props 傳遞過來的 event_id
      name: userInfo[0].username,
      email: userInfo[0].email,
      phone: userInfo[0].phone,
      gender: '保留',
      born_date: userInfo[0].birth_date,
      id_number: userInfo[0].id_number,
      attendence_status: 'attended',
      ...formData,
    }
    console.log('提交的表單資料:', completeFormData)

    const baseURL = 'http://localhost:3005/api/group-participant'
    try {
      const res = await fetch(baseURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(completeFormData),
      })

      if (res.ok) {
        alert('報名成功！')
        onClose()
        window.location.href = 'http://localhost:3000/group-camping/my-event'
      } else {
        const errorData = await res.json()
        console.error('報名失敗:', errorData)
        alert('報名失敗，請再試一次。')
      }
    } catch (error) {
      console.error('網路錯誤:', error)
      alert('報名失敗，請再試一次。')
    }
  }

  return (
    <>
      {userInfo.length > 0 ? ( // 檢查是否有資料
        <div className={`${styles.modalJoin} ${styles.globe}`}>
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={`${styles.modalContent} ${styles.formJoin}`}>
              <div className={`${styles.head} ${styles.h6Tc}`}>報名人資料</div>
              <div className={`${styles.content} ${styles.asideMainTc}`}>
                <div className={styles.info}>
                  <div className={styles.title}>姓名</div>
                  <div
                    id="userName"
                    className={`${styles.answer} ${styles.textGray}`}
                  >
                    {userInfo[0].username}
                  </div>
                </div>
                <div className={styles.info}>
                  <div className={`${styles.title} ${styles.headerEn}`}>
                    Mail
                  </div>
                  <div
                    id="email"
                    className={`${styles.answer} ${styles.textGray}`}
                  >
                    {userInfo[0].email}
                  </div>
                </div>
                <div className={styles.info}>
                  <div className={styles.title}>聯絡電話</div>
                  <div id className={`${styles.answer} ${styles.textGray}`}>
                    {userInfo[0].phone}
                  </div>
                </div>
                <div className={styles.info}>
                  <div className={styles.title}>性別</div>
                  <div className={`${styles.answer} ${styles.gender}`}>
                    <div className={styles.formCheck}>
                      <input
                        className={styles.formCheckInput}
                        disabled
                        id="male"
                        type="radio"
                        value="男性"
                      />
                      <label
                        className={`${styles.formCheckLabel} ${styles.textGray}`}
                        htmlFor="male"
                      >
                        男性
                      </label>
                    </div>
                    <div className={styles.formCheck}>
                      <input
                        className={styles.formCheckInput}
                        disabled
                        id="female"
                        type="radio"
                        value="女性"
                      />
                      <label
                        className={`${styles.formCheckLabel} ${styles.textGray}`}
                        htmlFor="female"
                      >
                        女性
                      </label>
                    </div>
                    <div className={styles.formCheck}>
                      <input
                        className={styles.formCheckInput}
                        defaultChecked
                        disabled
                        id="preserve"
                        type="radio"
                        value="保留"
                      />
                      <label
                        className={`${styles.formCheckLabel} ${styles.textGray}`}
                        htmlFor="preserve"
                      >
                        保留
                      </label>
                    </div>
                  </div>
                </div>
                <div className={styles.info}>
                  <div className={styles.title}>出生日期</div>
                  <div className={`${styles.answer} ${styles.textGray}`}>
                    {userInfo[0].birth_date}
                  </div>
                </div>
                <div className={styles.info}>
                  <div className={styles.title}>身分證字號</div>
                  <div className={`${styles.answer} ${styles.textGray}`}>
                    {userInfo[0].id_number}
                  </div>
                </div>
                <div className={styles.info}>
                  <div className={styles.title}>健康狀況</div>
                  <div className={`${styles.answer} ${styles.healthStatus}`}>
                    <div className={styles.formCheck}>
                      <input
                        className={styles.formCheckInput}
                        id="asthma"
                        type="checkbox"
                        value="氣喘"
                      />
                      <label className={styles.formCheckLabel} htmlFor="asthma">
                        氣喘
                      </label>
                    </div>
                    <div className={styles.formCheck}>
                      <input
                        className={styles.formCheckInput}
                        id="altitude-sickness"
                        type="checkbox"
                        value="高山症"
                      />
                      <label
                        className={styles.formCheckLabel}
                        htmlFor="altitude-sickness"
                      >
                        高山症
                      </label>
                    </div>
                    <div className={styles.formCheck}>
                      <input
                        className={styles.formCheckInput}
                        id="acrophobia"
                        type="checkbox"
                        value="懼高症"
                      />
                      <label
                        className={styles.formCheckLabel}
                        htmlFor="acrophobia"
                      >
                        懼高症
                      </label>
                    </div>
                    <div className={styles.formCheck}>
                      <input
                        className={styles.formCheckInput}
                        id="heart-disease"
                        type="checkbox"
                        value="心臟病"
                      />
                      <label
                        className={styles.formCheckLabel}
                        htmlFor="heart-disease"
                      >
                        心臟病
                      </label>
                    </div>
                    <div className={styles.formCheck}>
                      <input
                        className={styles.formCheckInput}
                        id="hypertension"
                        type="checkbox"
                        value="高血壓"
                      />
                      <label
                        className={styles.formCheckLabel}
                        htmlFor="hypertension"
                      >
                        高血壓
                      </label>
                    </div>
                    <div className={styles.formCheck}>
                      <input
                        className={styles.formCheckInput}
                        id="diabetes"
                        type="checkbox"
                        value="糖尿病"
                      />
                      <label
                        className={styles.formCheckLabel}
                        htmlFor="diabetes"
                      >
                        糖尿病
                      </label>
                    </div>
                    <div className={styles.formCheck}>
                      <input
                        className={styles.formCheckInput}
                        id="g6pd-deficiency"
                        type="checkbox"
                        value="蠶豆症"
                      />
                      <label
                        className={styles.formCheckLabel}
                        htmlFor="g6pd-deficiency"
                      >
                        蠶豆症
                      </label>
                    </div>
                    <div className={styles.formCheck}>
                      <input
                        className={styles.formCheckInput}
                        id="pregnancy"
                        type="checkbox"
                        value="懷孕"
                      />
                      <label
                        className={styles.formCheckLabel}
                        htmlFor="pregnancy"
                      >
                        懷孕
                      </label>
                    </div>
                    <div className={styles.formCheck}>
                      <input
                        className={styles.formCheckInput}
                        id="stroke"
                        type="checkbox"
                        value="中風"
                      />
                      <label className={styles.formCheckLabel} htmlFor="stroke">
                        中風
                      </label>
                    </div>
                    <div className={styles.formCheck}>
                      <input
                        className={styles.formCheckInput}
                        id="epilepsy"
                        type="checkbox"
                        value="癲癇"
                      />
                      <label
                        className={styles.formCheckLabel}
                        htmlFor="epilepsy"
                      >
                        癲癇
                      </label>
                    </div>
                    {/* <div className={`${styles.formCheck} ${styles.others}`}>
                      <input
                        className={styles.formCheckInput}
                        id="others"
                        type="checkbox"
                        value=""
                      />
                      <label
                        className={`${styles.other} ${styles.formCheckLabel}`}
                        htmlFor="others"
                      >
                        <div className={styles.enterOther} htmlFor="others">
                          <span className={styles.title1} htmlFor="others">
                            其他
                          </span>
                          <input type="text" htmlFor="others" />
                        </div>
                      </label>
                    </div> */}
                  </div>
                </div>
                <div className={styles.info}>
                  <label className={styles.answer}>
                    <div className={styles.title}>緊急聯絡人姓名</div>
                    <input
                      type="text"
                      name="emergency_contact_person"
                      value={formData.emergency_contact_person}
                      onChange={handleChange}
                    />
                  </label>
                </div>
                <div className={styles.info}>
                  <label className={styles.answer}>
                    <div className={styles.title}>緊急聯絡人電話</div>
                    <input
                      type="text"
                      name="emergency_contact_phone"
                      value={formData.emergency_contact_phone}
                      onChange={handleChange}
                    />
                  </label>
                </div>
                <div className={styles.info}>
                  <label className={styles.answer}>
                    <div className={styles.title}>備註</div>
                    <input
                      type="text"
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                    />
                  </label>
                </div>
              </div>
            </div>
            <div className={`${styles.modalContent} ${styles.consent}`}>
              <div className={`${styles.title} ${styles.h5tc}`}>
                個人資料提供同意書
              </div>
              <div className={styles.text}>
                <p className={styles.p2Tc}>
                  本同意書說明本主辦單位（以下簡稱本單位）將如何處理本表單所蒐集到的個人資料。當您按下「提交」，即表示您已閱讀、瞭解，並同意接受本同意書之所有內容及其後修改變更規定。
                  <br />
                  <br />
                  依個人資料保護法規範，請您於【各項活動】前務必詳細閱讀本聲明書之各項內容，若您參與本單位所舉辦的活動，表示您同意【活動承辦單位】蒐集、處理、利用您與相關人員之下列個人資料，始繼續進行後續相關步驟。
                  <br />
                  <br />
                  若您未滿二十歲，應請您的法定代理人閱讀、瞭解並同意本同意書之所有內容，及其後修改變更規定後，方予簽署，但若您已簽署，視為您已取得法定代理人之同意，並遵守以下所有規範。
                  <br />
                  <br />
                  <span className={`${styles.item} ${styles.p1Tc}`}>
                    一、基本資料之蒐集、更新及保管
                  </span>
                  <br />
                  1.
                  本單位蒐集您的個人資料在中華民國「個人資料保護法」與相關法令之規範下，依據本單位【資安之隱私權政策聲明】、【個人資料保護政策】蒐集、處理及利用您的個人資料。
                  <br />
                  2. 請於申請時提供您本人正確、最新及完整的個人資料。
                  <br />
                  3.
                  本單位因執行各項活動辦理業務，依目的不同，將蒐集您的個人資料包括：
                  <br />
                  (1)姓名、職稱、國民身分證統一編號、出生年月日
                  <br />
                  (2) 聯絡方式(戶籍地址、通訊地址、電話、電子信箱)
                  <br />
                  4.
                  若您的個人資料有任何異動，請主動向活動承辦人員申請更正，使其保持正確、最新及完整。
                  <br />
                  5.
                  若您提供錯誤、不實、過時或不完整或具誤導性的資料，您將損失參加活動之相關權益。
                  <br />
                  6.
                  您可依中華民國「個人資料保護法」，於「活動報名期間」、「活動辦理期間」及「活動結案期間」，就您的個人資料行使以下權利：
                  <br />
                  (1)請求查詢或閱覽。
                  <br />
                  (2)製給複製本。
                  <br />
                  (3)請求補充或更正。
                  <br />
                  (4)請求停止蒐集、處理及利用。（本項於上述三段期間，將停止您參加活動的權益）
                  <br />
                  (5)請求刪除。（本項於上述三段期間，將停止您參加活動的權益）
                  <br />
                  您行使上述權利時，須填具申請表並檢具身分證明文件向本單位提出申請。委託他人辦理，須另出具委託書並同時提供受託人身份證明文件以供核對。若申請人不符前述規定，本單位得請申請人補充資料，以為憑辦。
                  本單位執行職務或業務所必須者，本單位得拒絕之。
                  您欲執行上述權利時，請直接聯繫【活動業務承辦人員】，詳細聯絡方式請參考個別活動說明。因您行使上述權利，而導致權益受損時，本單位將不負相關賠償責任。
                  <br />
                  7.
                  報名平台上，所有活動之個人資料，一律於活動結束後一週自動刪除，不予保留。
                  <br />
                  <br />
                  <span className={`${styles.item} ${styles.p1Tc}`}>
                    二、蒐集個人資料之目的
                  </span>
                  <br />
                  1. 本單位為執行「各項活動報名及管理」需蒐集您的個人資料。
                  <br />
                  2.
                  本單位利用您的個人資料期間為「活動報名期間」起，經「活動辦理期間」至「活動結案期間」，若依個別活動管理需要，延長個人資料保存期間，則活動承辦人員將於活動說明，另行告知期限。您的個人資料利用地區為台灣地區。
                  <br />
                  <br />
                  <span className={`${styles.item} ${styles.p1Tc}`}>
                    三、基本資料之保密
                  </span>
                  <br />
                  您的個人資料受到本單位【資安之隱私權政策聲明】之保護及規範。請閱讀【資安之隱私權政策聲明】以查閱本單位完整【資安之隱私權政策聲明】。本單位各項活動承辦人員將克盡善良管理人責任，如違反「個人資料保護法」規定或因天災、事變或其他不可抗力所致者，致您的個人資料被竊取、洩漏、竄改、遭其他侵害者，本單位將於查明後以電話、信函、電子郵件或網站公告等方法，擇適當方式通知您。
                  <br />
                  <br />
                  <span className={`${styles.item} ${styles.p1Tc}`}>
                    四、同意書之效力
                  </span>
                  <br />
                  1.當您按下「提交」(即【資料送出按鈕】)表示您已簽署本同意書時，即表示您已閱讀、瞭解並同意本同意書之所有內容，您如違反下列條款時，本單位得隨時終止對您所提供之所有權益或服務。
                  <br />
                  2.本單位保留隨時修改本同
                  意書規範之權利，本單位將於修改規範時，於本單位網頁(站)公告修改之事實，不另作個別通知。如果您不同意修改的內容，請勿繼續接受本服務。否則將視為您已同意並接受本同意書該等增訂或修改內容之拘束。
                  <br />
                  3.您自本同意書取得的任何建議或資訊，無論是書面或口頭形式，除非本同意書條款有明確規定，均不構成本同意條款以外之任何保證。
                </p>
              </div>
            </div>
            <button
              className={`${styles.btnSubmit} ${styles.h6Tc}`}
              type="submit"
            >
              提交
            </button>
          </form>
          <button className={styles.close} onClick={onClose}>
            <span className="material-symbols-outlined"> close </span>
          </button>
        </div>
      ) : (
        <p>Loading...</p> // 資料尚未加載時顯示
      )}
    </>
  )
}
