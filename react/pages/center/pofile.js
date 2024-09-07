import React from 'react'

export default function pofile() {
  return (
    <>
      <div className="total">
        <header />
        <div className="container text-center">
          <div className="row justify-content-start ">
            <div className="col-2">col-2</div>
            <div className="col-1" />
            <div className="col-9" />
          </div>
          <div className="row justify-content-start ">
            <div className="col-2">col-2</div>
            <div className="col-1" />
            <div className="col-9">
              <div className="card1h">
                <p>Na_779的個人資料</p>
              </div>
              <div className="card1b">
                <div>
                  <form action="">
                    {/* disabled ture false  mui core textfield
                           55 班 0709 03. 0710 1.1
                           google 登入可以再做連動
                           */}
                    <div className="space mb-4">
                      {/* 寫兩個欄位 第一個先隱藏 第二個按編輯後 才顯示input框*/}
                      <label htmlFor="" className="input1">
                        帳號
                      </label>
                      <input
                        type="text"
                        className="input1"
                        placeholder="帳號"
                      />
                    </div>
                    <div className="space mb-4">
                      <label htmlFor="" className="input1">
                        姓名/護照名
                      </label>
                      <input
                        type="text"
                        className="input1"
                        placeholder="姓名/護照名"
                      />
                    </div>
                    <div className="space  mb-4">
                      <label htmlFor="" className="input1">
                        密碼
                      </label>
                      <input
                        type="password"
                        className="input1"
                        placeholder="密碼"
                      />
                      <button type="button" className="btn btn-link">
                        編輯
                      </button>
                    </div>
                    <div className="space  mb-4">
                      <label htmlFor="" className="input1">
                        生日
                      </label>
                      <input
                        type="date"
                        className="input1"
                        placeholder="生日"
                      />
                    </div>
                    <div className="space  mb-4">
                      <label htmlFor="" className="input1">
                        手機號碼
                      </label>
                      <input
                        type="text"
                        className="input1"
                        placeholder="手機號碼"
                      />
                      <button type="button" className="btn btn-link">
                        編輯
                      </button>
                    </div>
                    <div className="space  mb-4">
                      <label htmlFor="" className="input1">
                        身份證字號
                      </label>
                      <input
                        type="text"
                        className="input1"
                        placeholder="身份證字號"
                      />
                    </div>
                    <div className="space  mb-4">
                      <label htmlFor="" className="input1">
                        電子郵件
                      </label>
                      <input
                        type="email"
                        className="input1"
                        placeholder="電子郵件"
                      />
                      <button type="button" className="btn btn-link">
                        編輯
                      </button>
                    </div>
                    <div className="space  mb-4">
                      <label htmlFor="" className="input1">
                        地址
                      </label>
                      <input
                        type="text"
                        className="input1"
                        placeholder="地址"
                      />
                      <button type="button" className="btn btn-link">
                        編輯
                      </button>
                    </div>
                  </form>
                </div>
                <div className="card2">
                  <div className="card2h" />
                  <div className="card2b">
                    {/* <div >
                              <input class="form-control form-control-sm" id="formFileSm" type="file">
                          </div> */}
                    {/* <img src="/images/胖達.jpg" alt="" name="userPhoto"> */}
                  </div>
                  Na_779
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
