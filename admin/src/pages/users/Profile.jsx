import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import GuestNavbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import LeftSideBarComponent from "../../components/LeftSideBarComponent";
import AuthUser from "../../components/AuthUser";

const Profile = () => {

  const { getToken, token, logout } = AuthUser();
  const { user } = AuthUser();
  const navigate = useNavigate();


  useEffect(() => {
    if (!user) {
      navigate('/login'); // Redirect to the login page if `user` is null or undefined
    }
  }, [user, navigate]);




  return (
    <>
      <Helmet>
        <title>Hoster List</title>
      </Helmet>

      <GuestNavbar />
      <LeftSideBarComponent />

      {/* Start main section */}
      <div className="main_section">
        {/*main section start here  */}
        <div className="container-fluid">
          <div className="row">
            <div className="col-xxl-9">
              <div className="title_section">
                <a onClick={() => navigate(-1)}><i className="fa-solid fa-chevron-left" /></a>
                <h1 className="page_title">User Profile </h1>
              </div>
              {/* profile details section start here  */}
              <div className="user_profile">
                <ul className="nav nav-tabs tab_buttons" id="myTab" role="tablist">
                  <li className="nav-item" role="presentation">
                    <button className="nav-link active" id="Bio-tab" data-bs-toggle="tab" data-bs-target="#Bio" type="button" role="tab" aria-controls="Bio" aria-selected="true">Bio</button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button className="nav-link" id="security-tab" data-bs-toggle="tab" data-bs-target="#security" type="button" role="tab" aria-controls="security" aria-selected="false" tabIndex={-1}>Settings &amp; Privacy</button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button className="nav-link" id="contest-tab" data-bs-toggle="tab" data-bs-target="#contest" type="button" role="tab" aria-controls="contest" aria-selected="false" tabIndex={-1}>Contest</button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button className="nav-link" id="token-tab" data-bs-toggle="tab" data-bs-target="#token" type="button" role="tab" aria-controls="token" aria-selected="false" tabIndex={-1}>Token</button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button className="nav-link" id="share-tab" data-bs-toggle="tab" data-bs-target="#share" type="button" role="tab" aria-controls="share" aria-selected="false" tabIndex={-1}>Share</button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button className="nav-link" id="token-tab" data-bs-toggle="tab" data-bs-target="#membership" type="button" role="tab" aria-controls="membership" aria-selected="false" tabIndex={-1}>Membership</button>
                  </li>
                </ul>
                <div className="tab-content" id="myTabContent">
                  {/* bio */}
                  <div className="tab-pane fade show active" id="Bio" role="tabpanel" aria-labelledby="Bio-tab">
                    {/* profile details section start here  */}
                    <div className="user_profile px-4">
                      {/* <i class="fa-solid fa-user main_profile"></i> */}
                      {/* <div class="profile_section_title pt-5">
                                      <h1>Personal details</h1>
                                      <a href="#" class="btn_action="""> Edit</a>
                                  </div> */}
                      <ul className="pt-4">
                        <li>
                          <h6>FUll name</h6>
                          <strong>Jhone Smith</strong>
                        </li>
                        <li>
                          <h6>User name</h6>
                          <strong>Profile</strong>
                        </li>
                        <li>
                          <h6>Email</h6>
                          <strong>youremail.@mail.com</strong>
                        </li>
                        <li>
                          <h6>Mobile</h6>
                          <strong>5764413124464</strong>
                        </li>
                        <li>
                          <h6>Date of birth</h6>
                          <strong>25/10/2000</strong>
                        </li>
                      </ul>
                    </div>
                    {/* profile style 2 */}
                    <div className="user_profile_2">
                      <div className="profile_section_title pt-5">
                        <h1>Personal details</h1>
                        <a href="#" className="btn_action="> Edit</a>
                      </div>
                      <a href="#">Edit Bio</a>
                      <table>
                        <tbody><tr>
                          <td className="text-start">Real Name:</td>
                          <td className="text-start">Jhone Smith</td>
                        </tr>
                          <tr>
                            <td className="text-start">Followers:</td>
                            <td className="text-start">0</td>
                          </tr>
                          <tr>
                            <td className="text-start">We are:</td>
                            <td className="text-start">Male</td>
                          </tr>
                          <tr>
                            <td className="text-start">Location:</td>
                            <td className="text-start">Dhaka, Bangladesh</td>
                          </tr>
                          <tr>
                            <td className="text-start">Social Media:</td>
                            <td className="text-start">You must be age verified to add new social media
                            </td>
                          </tr>
                        </tbody></table>
                    </div>
                  </div>
                  {/* security  */}
                  <div className="tab-pane fade" id="security" role="tabpanel" aria-labelledby="security-tab">
                    {/* security section start here  */}
                    <form action="">
                      <div className="user_profile_2 settings">
                        <div className="profile_section_title pt-5 border-0">
                          <h1>Security Settings</h1>
                        </div>
                        <a href="#">Update Password</a>
                        <a href="#">View the security center and adjust Two-Step Verification
                          settings </a>
                        <div className="profile_section_title pt-5 border-0">
                          <h1>Personal Data</h1>
                        </div>
                        <table>
                          <tbody><tr>
                            <td className="text-start">Email Address:</td>
                            <td className="text-start">
                              <h6>sekhhasina052024001@gmail.com</h6>
                              <p>E-mail <span className="badge bg-success">Verified</span></p>
                              <p><a href="#" className="m-0 p-0">Change email address</a></p>
                            </td>
                          </tr>
                            <tr>
                              <td className="text-start">We are: *</td>
                              <td className="text-start">
                                <select className="form-">
                                  <option value>Couple</option>
                                  <option value>Men</option>
                                  <option value>Women</option>
                                </select>
                              </td>
                            </tr>
                            <tr>
                              <td className="text-start">Site Language:</td>
                              <td className="text-start">
                                <select className="form-">
                                  <option value>English</option>
                                </select>
                              </td>
                            </tr>
                            <tr>
                              <td className="text-start">Email Me When Someone I Follow Comes Online:
                              </td>
                              <td className="text-start">
                                <input type="checkbox" />
                              </td>
                            </tr>
                            <tr>
                              <td className="text-start">Send Me a Browser Notification When Someone I
                                Follow Comes Online:</td>
                              <td className="text-start">
                                <input type="checkbox" />
                              </td>
                            </tr>
                            <tr>
                              <td className="text-start">Subscribe to App Developer Emails:</td>
                              <td className="text-start">
                                <input type="checkbox" />
                              </td>
                            </tr>
                            <tr>
                              <td className="text-start">Subscribe to Newsletter Emails:</td>
                              <td className="text-start">
                                <input type="checkbox" />
                              </td>
                            </tr>
                          </tbody></table>
                        <div className="profile_section_title pt-5 border-0">
                          <h1>Broudcast Settings</h1>
                        </div>
                        <table>
                          <tbody><tr>
                            <td>List My Cam on the Home Page:</td>
                            <td>
                              <select className="form-">
                                <option value>Yes</option>
                                <option value>No</option>
                              </select>
                            </td>
                          </tr>
                            <tr>
                              <td>Show my country flag on the home page thumbnail</td>
                              <td>
                                <input type="checkbox" />
                              </td>
                            </tr>
                            <tr>
                              <td>Show My Cam to These Users: *</td>
                              <td>WomenMenCouplesTrans</td>
                            </tr>
                            <tr>
                              <td>Password Required for Others to View Your Cam:</td>
                              <td>
                                <input type="text" style={{ minWidth: 100 }} />
                                <p>This will lock your room to all users unless they know this
                                  password, and hide your cam from the home page.
                                  Be wary of users asking you to set a password, This is NOT a
                                  private show and you will NOT receive tokens for setting a
                                  password.
                                </p>
                              </td>
                            </tr>
                            <tr>
                              <td>Rules for Your Room:</td>
                              <td>
                                <textarea cols={30} rows={3} defaultValue={""} />
                                <p>List rules for your public chat here. Users will be required
                                  to accept your rules before being able to send messages in
                                  your room. 1024 character limit.
                                </p>
                              </td>
                            </tr>
                            <tr>
                              <td>Block Access to Users in These Countries:</td>
                              <td>
                                <div className="d-flex">
                                  <select style={{ minWidth: 100 }}>
                                    <option value>Afganistan</option>
                                    <option value>Africa</option>
                                    <option value>USA</option>
                                    <option value>UK</option>
                                    <option value>UAE</option>
                                  </select>
                                  <select style={{ minWidth: 100 }}>
                                  </select>
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td>Block Access to Users in These Regions:</td>
                              <td>
                                <div className="d-flex">
                                  <select style={{ minWidth: 100 }}>
                                    <option value>Region 1</option>
                                    <option value>Region 2</option>
                                    <option value>Region 3</option>
                                    <option value>Region 4</option>
                                    <option value>Region 5</option>
                                    <option value>Region 6</option>
                                  </select>
                                  <select style={{ minWidth: 100 }}>
                                  </select>
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td>Appear on Network Sites:</td>
                              <td>
                                <select className="form-">
                                  <option value>Yes</option>
                                  <option value>No</option>
                                </select>
                                <p>You will have less viewers if you choose NO.</p>
                              </td>
                            </tr>
                            <tr>
                              <td>Show My Satisfaction="" Score:</td>
                              <td>
                                <select className="form-">
                                  <option value>Yes</option>
                                  <option value>No</option>
                                </select>
                                <p>You will have less viewers if you choose NO.</p>
                              </td>
                            </tr>
                          </tbody></table>
                        <div className="profile_section_title pt-5 border-0">
                          <h1>Broudcast Settings</h1>
                        </div>
                        <table>
                          <tbody><tr>
                            <td>List My Cam on the Home Page:</td>
                            <td>
                              <select className="form-">
                                <option value>Yes</option>
                                <option value>No</option>
                              </select>
                            </td>
                          </tr>
                          </tbody></table>
                        <div className="profile_section_title pt-5 border-0">
                          <h1>Private Show Settings</h1>
                        </div>
                        <table>
                          <tbody><tr>
                            <td>Allow Private Shows:</td>
                            <td>
                              <select className="form-">
                                <option value>Yes</option>
                                <option value>No</option>
                              </select>
                            </td>
                          </tr>
                            <tr>
                              <td>Allow Private Show Recordings:</td>
                              <td>
                                <select className="form-">
                                  <option value>Yes</option>
                                  <option value>No</option>
                                </select>
                                <p>After a private show, members may receive a non-downloadable
                                  recording in their private collection. Disabling this will
                                  cause less users to purchase your private shows.</p>
                              </td>
                            </tr>
                            <tr>
                              <td>Private Show Tokens Per Minute: *</td>
                              <td>
                                <select className="form-">
                                  <option value>0</option>
                                  <option value>30</option>
                                  <option value>60</option>
                                  <option value>90</option>
                                  <option value>120</option>
                                  <option value>180</option>
                                </select>
                              </td>
                            </tr>
                            <tr>
                              <td>Private Show Minimum Minutes: *</td>
                              <td>
                                <select className="form-">
                                  <option value>0</option>
                                  <option value>30</option>
                                  <option value>60</option>
                                  <option value>90</option>
                                  <option value>120</option>
                                  <option value>180</option>
                                </select>
                              </td>
                            </tr>
                            <tr>
                              <td>Spy on Private Show Tokens Per Minute: *</td>
                              <td>
                                <select className="form-">
                                  <option value>Yes</option>
                                  <option value>No</option>
                                </select>
                              </td>
                            </tr>
                            <tr>
                              <td>Allow Private Shows:</td>
                              <td>
                                <select className="form-">
                                  <option value>Yes</option>
                                  <option value>No</option>
                                </select>
                              </td>
                            </tr>
                          </tbody></table>
                      </div>
                    </form>
                    {/* security seciton end here  */}
                  </div>
                  {/* contest  */}
                  <div className="tab-pane fade" id="contest" role="tabpanel" aria-labelledby="contest-tab">
                    {/* security section start here  */}
                    <form action="">
                      <div className="user_profile_2 settings">
                        <a href="#" className="ms-0">Refresh Stats</a>
                        <p className="text-white">Every hour, the cam with the most points wins a $10
                          prize. The cam in 2nd place wins a $5 prize. <a href="#" className="d-inline">See contest details.</a></p>
                        <div className="profile_section_title pt-2 ">
                          <h1>Current Contest Statistics for: <span>Sep 23, 2024, 6:00 PM to Sep
                            23, 2024, 6:59 PM</span></h1>
                        </div>
                        <table>
                          <tbody><tr>
                            <td>Unique Registered Viewers:</td>
                            <td>0</td>
                          </tr>
                            <tr>
                              <td>Your Points:</td>
                              <td>0</td>
                            </tr>
                            <tr>
                              <td>Your Rank:</td>
                              <td>N/A</td>
                            </tr>
                          </tbody></table>
                        <div className="profile_section_title pt-2 ">
                          <h1>Current Hour's Top Cams</h1>
                        </div>
                        <ul className="winner_list">
                          <li>
                            <div className="winner_list_content">
                              <div className="image_part">
                                <h6>1.</h6>
                                <img src="/images/models/model(1).png" className="img-fluid" />
                              </div>
                              <div className="name_part">
                                <a href="hoster-profile.html">Vanandjuani</a>
                                <span>Unique Registered Viewers
                                  Watching:552Points:371</span>
                              </div>
                            </div>
                          </li>
                          <li>
                            <div className="winner_list_content">
                              <div className="image_part">
                                <h6>1.</h6>
                                <img src="/images/models/model(2).png" className="img-fluid" />
                              </div>
                              <div className="name_part">
                                <a href="hoster-profile.html">Vanandjuani</a>
                                <span>Unique Registered Viewers
                                  Watching:552Points:371</span>
                              </div>
                            </div>
                          </li>
                          <li>
                            <div className="winner_list_content">
                              <div className="image_part">
                                <h6>2.</h6>
                                <img src="/images/models/model(3).png" className="img-fluid" />
                              </div>
                              <div className="name_part">
                                <a href="hoster-profile.html">Vanandjuani</a>
                                <span>Unique Registered Viewers
                                  Watching:552Points:371</span>
                              </div>
                            </div>
                          </li>
                          <li>
                            <div className="winner_list_content">
                              <div className="image_part">
                                <h6>9.</h6>
                                <img src="/images/models/model(4).png" className="img-fluid" />
                              </div>
                              <div className="name_part">
                                <a href="hoster-profile.html">Vanandjuani</a>
                                <span>Unique Registered Viewers
                                  Watching:552Points:371</span>
                              </div>
                            </div>
                          </li>
                          <li>
                            <div className="winner_list_content">
                              <div className="image_part">
                                <h6>10.</h6>
                                <img src="/images/models/model(5).png" className="img-fluid" />
                              </div>
                              <div className="name_part">
                                <a href="hoster-profile.html">Vanandjuani</a>
                                <span>Unique Registered Viewers
                                  Watching:552Points:371</span>
                              </div>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </form>
                  </div>
                  <div className="tab-pane fade" id="token" role="tabpanel" aria-labelledby="token-tab">
                    {/* token state  */}
                    <form action="">
                      <div className="user_profile_2 settings">
                        <a href="#" className="ms-0">Refresh Stats</a>
                        <a href="#" className="ms-0"> Download Transaction="" History</a>
                        <p className="text-white">Token Balance: 0</p>
                        <div className="profile_section_title pt-2 ">
                          <h1>Current Contest Statistics for: <span>Sep 23, 2024, 6:00 PM to Sep
                            23, 2024, 6:59 PM</span></h1>
                        </div>
                        <p className="my-2">Please verify your identity to enable tokens on your account.</p>
                        <a href="#" className="ms-0">Broadcaster Verification Form</a>
                        <p>Your Account's Activity:</p>
                        <table className="table table-dark">
                          <thead>
                            <tr>
                              <th>Date</th>
                              <th>action=""</th>
                              <th>Tokens</th>
                              <th>Token Balance</th>
                            </tr>
                          </thead>
                        </table>
                      </div>
                    </form>
                  </div>
                  <div className="tab-pane fade" id="share" role="tabpanel" aria-labelledby="share-tab">
                    {/* Share  */}
                    <form action="">
                      <div className="user_profile_2 settings">
                        <a href="#" className="ms-0">Refresh Stats</a>
                        <a href="#" className="ms-0"> Download Transaction="" History</a>
                        <p className="text-white">Earn up to 10 tokens for every registered user and 500 tokens for users who broadcast (broadcasters must earn $20.00 before they qualify).</p>
                        <p className="text-white">Please send to chaturbate using one of the link codes below.</p>
                        <p className="text-white">Please send to chaturbate using one of the link codes below.</p>
                        <div className="profile_section_title pt-2 mb-3">
                          <h1>Current Contest Statistics for: <span>Sep 23, 2024, 6:00 PM to Sep
                            23, 2024, 6:59 PM</span></h1>
                        </div>
                        <div className="form-group  mb-2">
                          <label >Share Hasin052024's Cam:</label>
                          <input type="text" className="form-control" defaultValue="https://chaturbate.com/in/?tour=7Bge&campaign=HBrh8&track=default&room=hasin052024" />
                        </div>
                        <div className="form-group  mb-2">
                          <label >Share Chaturbate.com:</label>
                          <input type="text" className="form-control" defaultValue="https://chaturbate.com/in/?tour=OT2s&campaign=HBrh8&track=default" />
                        </div>
                        <div className="form-group  mb-2">
                          <label >Share Chaturbate.com:</label>
                          <input type="text" className="form-control" defaultValue="https://chaturbate.com/in/?tour=OT2s&campaign=HBrh8&track=default" />
                        </div>
                        <div className="form-group  mb-2">
                          <label >Embed Hasin052024's Cam on Your Webpage:</label>
                          <input type="text" className="form-control" defaultValue="<iframe src='https://cbxyz.com/in/?tour=SHBY&campaign=HBrh8&track=embed&room=hasin052024' height=528 width=850 style='border: none;'></iframe>" />
                        </div>
                        <div className="form-group mb-2">
                          <label >Embed Chaturbate's Top Cam on Your Webpage:</label>
                          <input type="text" className="form-control" defaultValue="<iframe src='https://cbxyz.com/in/?tour=SHBY&campaign=HBrh8&track=embed&room=hasin052024' height=528 width=850 style='border: none;'></iframe>" />
                        </div>
                        <p>See details about tokens earned in the <a href="#" className="d-inline mt-2">affiliate program stats</a></p>
                      </div>
                    </form>
                  </div>
                  <div className="tab-pane fade" id="membership" role="tabpanel" aria-labelledby="membership-tab">
                    {/* Share  */}
                    <form action="">
                      <div className="user_profile_2 settings">
                        <div className="profile_section_title pt-2 mb-3">
                          <h1>You Have No Active Memberships</h1>
                        </div>
                        <p><a href="#" className="d-inline">Upgrade to supporter</a> for no ads, private messaging, and more!</p>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
            {/* right side part start here */}
            <div className="col-xxl-3 d-xxl-block d-none ">
              <div className="right_sidebar">
                <a href="games.html">
                  <div className="ads_section">
                    <img src="/images/300x600.gif" className="ads_image img-fluid" />
                  </div>
                </a>
                <a href="games.html">
                  <div className="ads_section_two">
                    <img src="/images/adsbannar.webp" className="ads_image img-fluid" />
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
        {/* footer part start here  */}
        <footer>
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-12">
                <div className="footer_top">
                  <div className="row">
                    <div className="col-md-8">
                      <div className="footer_top_right">
                        <h4>FG Games</h4>
                        <p>Casinos online have not always been around, but we can safely say that online casinos have been
                          used a lot since they came on the market. And it's not in short demand nor options, and now in
                          2023, we have 1000s and 1000s to pick from – it's just a matter of what you like and what
                          payment options you would like to see at the casino.</p>
                        <p>Players are always looking for something new, which will help make the gaming experience so
                          much better and more accessible. Allowing the player to focus on the absolute fun of a casino,
                          that's right, the games themselves.</p>
                        <a href="about.html" className="more_about btn btn-default">More about <i className="fa-solid fa-chevron-right" /></a>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="footer_top_left">
                        <h5>Help us to improve your experience.</h5>
                        <h6>Get rewarded for your valuable feedback!</h6>
                        <div className="form-group">
                          <textarea cols={30} rows={3} className="form-control" defaultValue={""} />
                        </div>
                        <button className="btn more_about">Submit</button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="footer_top mb-0">
                  <div className="row">
                    <div className="col-md-2 col-4">
                      <div className="footer_link_list">
                        <h5>Casino</h5>
                        <ul>
                          <li><a href="games.html">Casino Home</a></li>
                          <li><a href="games.html">Slots</a></li>
                          <li><a href="games.html">Live Casino</a></li>
                          <li><a href="games.html">New Releases</a></li>
                          <li><a href="games.html">Recommended</a></li>
                          <li><a href="games.html">Table Game</a></li>
                          <li><a href="games.html">BlackJacksho</a></li>
                          <li><a href="games.html">Roulette</a></li>
                          <li><a href="games.html">Baccarat</a></li>
                        </ul>
                      </div>
                    </div>
                    <div className="col-md-2 col-4">
                      <div className="footer_link_list">
                        <h5>Sports</h5>
                        <ul>
                          <li><a href="games.html">Sports Home</a></li>
                          <li><a href="games.html">Live</a></li>
                          <li><a href="games.html">Rules</a></li>
                          <li><a href="games.html">Sport Betting Insights</a></li>
                        </ul>
                      </div>
                    </div>
                    <div className="col-md-2 col-4">
                      <div className="footer_link_list">
                        <h5>Promo</h5>
                        <ul>
                          <li><a href="#">Vip Club</a></li>
                          <li><a href="#">Affiliate</a></li>
                          <li><a href="#">Promotions</a></li>
                          <li><a href="#">Lottery</a></li>
                          <li><a href="#">Refer a friend</a></li>
                        </ul>
                      </div>
                    </div>
                    <div className="col-md-2 col-4">
                      <div className="footer_link_list">
                        <h5>Support/Legal</h5>
                        <ul>
                          <li><a href="#">Help Center</a></li>
                          <li><a href="#">Important Announcement</a></li>
                          <li><a href="#">BlockDance B.V.</a></li>
                          <li><a href="#">Gamble Aware</a></li>
                          <li><a href="#">Faireness</a></li>
                          <li><a href="#">FAQ</a></li>
                          <li><a href="#">Privacy Policy</a></li>
                          <li><a href="#">Terms Of Service</a></li>
                          <li><a href="#">Law Enforcement</a></li>
                          <li><a href="#">Self-exclusion</a></li>
                          <li><a href="#">AML</a></li>
                          <li><a href="#">Design Resources</a></li>
                          <li><a href="#">App</a></li>
                          <li><a href="#">Live Support</a></li>
                        </ul>
                      </div>
                    </div>
                    <div className="col-md-2 col-4">
                      <div className="footer_link_list">
                        <h5>About Us</h5>
                        <ul>
                          <li><a href="#" target="_blank">News</a></li>
                          <li><a href="#">Work with us</a></li>
                          <li><a href="#">Business Contacts</a></li>
                          <li><a href="#">Help Desk</a></li>
                          <li><a href="#">Verify Representative</a></li>
                        </ul>
                      </div>
                    </div>
                    <div className="col-md-2 col-4">
                      <div className="footer_link_list">
                        <h5>Social Links</h5>
                        <ul>
                          <li><a href="#">Casino Home</a></li>
                          <li><a href="#">Slots</a></li>
                          <li><a href="#">Live Casino</a></li>
                          <li><a href="#">New Releases</a></li>
                          <li><a href="#">Recommended</a></li>
                          <li><a href="#">Table Game</a></li>
                          <li><a href="#">BlackJacksho</a></li>
                          <li><a href="#">Roulette</a></li>
                          <li><a href="games.html">Baccarat</a></li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </footer>
        {/* footer part end here  */}
      </div>


      {/* End main section  */}








      <Footer />
    </>
  );
};

export default Profile;