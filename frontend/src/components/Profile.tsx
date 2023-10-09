import { useCallback, useState, useEffect } from "react";
import axios from 'axios';
import { useParams } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import log1 from "../img/log1.png";

import { GetTecsResponse } from "./Home";

interface GetProfileResponse {
	name: string,
	icon_url: string,
	sns_link: string,
	comment: string,
	join_date: string,
	department: string
	interests: {id: number, name: string}[],
	expertises: {id: number, name: string, years: number}[],
	experiences: {id: number, name: string, years: number}[],
}

function Profile() {
  const { user_id } = useParams();

  const [is_editing, setIsEditing] = useState(false);
  const [interest_tec_substring, setInterestTecSubstring] = useState("");
  const [expertise_tec_substring, setExpertiseTecSubstring] = useState("");
  const [experience_tec_substring, setExperienceTecSubstring] = useState("");
  const [suggested_interest_tecs, setSuggestedInterestTecs] = useState([] as {id: number, name: string}[]);
  const [suggested_expertise_tecs, setSuggestedExpertiseTecs] = useState([] as {id: number, name: string}[]);
  const [suggested_experience_tecs, setSuggestedExperienceTecs] = useState([] as {id: number, name: string}[]);

  const [name, setName] = useState("");
  const [icon_url, setIconUrl] = useState("");

  // ユーザー情報を取得
  const { user } = useAuthContext();

  const [sns_link, setSnsLink] = useState("");
  const [comment, setComment] = useState("");
  const [join_date, setJoinDate] = useState("1900-12-17");
  const [department, setDepartment] = useState("");
  const [interests, setInterests] = useState([] as {id: number, name: string}[]);
  const [expertises, setExpertises] = useState([] as {id: number, name: string, years: number}[]);
  const [experiences, setExperiences] = useState([] as {id: number, name: string, years: number}[]);

  const [edited_sns_link, setEditedSnsLink] = useState("");
  const [edited_comment, setEditedComment] = useState("");
  const [edited_join_date, setEditedJoinDate] = useState("1900-12-17");
  const [edited_department, setEditedDepartment] = useState("");
  const [edited_interests, setEditedInterests] = useState([] as {id: number, name: string}[]);
  const [edited_expertises, setEditedExpertises] = useState([] as {id: number, name: string, years: number}[]);
  const [edited_experiences, setEditedExperiences] = useState([] as {id: number, name: string, years: number}[]);

  const edit_start = () => {
    setEditedSnsLink(sns_link);
    setEditedComment(comment);
    setEditedJoinDate(join_date);
    setEditedDepartment(department);
    setEditedInterests(interests);
    setEditedExpertises(expertises);
    setEditedExperiences(experiences);
    setIsEditing(true);
  };
  const edit_end = useCallback(() => {
    setIsEditing(false);
  }, []);
  const edit_complete = () => {
    setIsEditing(false);
    user?.getIdToken().then(token => {
      axios.post('http://localhost:8000/update-profile/', {
        edited_sns_link: edited_sns_link,
        edited_comment: edited_comment,
        edited_join_date: edited_join_date,
        edited_department: edited_department,
        edited_interests: edited_interests.map(interest => interest.id),
        edited_expertises: edited_expertises.map(expertise => [expertise.id, expertise.years]),
        edited_experiences: edited_experiences.map(experience => [experience.id, experience.years]),
      },
      { headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
      }).then((res) => {
        if(res.data.is_accepted) {
          setSnsLink(edited_sns_link);
          setComment(edited_comment);
          setJoinDate(edited_join_date);
          setDepartment(edited_department);
          setInterests(edited_interests);
          setExpertises(edited_expertises);
          setExperiences(edited_experiences);
        }
      });
    });
  };

  // 興味のある技術専用タグサジェストを変更する処理
  const interestTecSubstringChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInterestTecSubstring(e.target.value.trim());
    axios.get('http://localhost:8000/get-suggested-tecs/' + e.target.value.trim())
    .then((res) => {
      const get_suggested_tecs_res: GetTecsResponse = res.data;
      setSuggestedInterestTecs(get_suggested_tecs_res.tecs);
    })
    .catch((err) => {
      console.log(err);
    });
  }, []);

  // 得意な技術専用タグサジェストを変更する処理
  const expertiseTecSubstringChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setExpertiseTecSubstring(e.target.value.trim());
    axios.get('http://localhost:8000/get-suggested-tecs/' + e.target.value.trim())
    .then((res) => {
      const get_suggested_tecs_res: GetTecsResponse = res.data;
      setSuggestedExpertiseTecs(get_suggested_tecs_res.tecs);
    })
    .catch((err) => {
      console.log(err);
    });
  }, []);

  // 業務経験のある技術専用タグサジェストを変更する処理
  const experienceTecSubstringChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setExperienceTecSubstring(e.target.value.trim());
    axios.get('http://localhost:8000/get-suggested-tecs/' + e.target.value.trim())
    .then((res) => {
      const get_suggested_tecs_res: GetTecsResponse = res.data;
      setSuggestedExperienceTecs(get_suggested_tecs_res.tecs);
    })
    .catch((err) => {
      console.log(err);
    });
  }, []);

  const editedSnsLinkChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedSnsLink(e.target.value.trim());
  }, []);
  const editedCommentChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedComment(e.target.value.trim());
  }, []);
  const editedJoinDateChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value.trim());
    setEditedJoinDate(e.target.value.trim());
  }, []);
  const editedDepartmentChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedDepartment(e.target.value.trim());
  }, []);

  // 編集中に新たにタグを追加する処理
  const editedInterestsAdd = useCallback((suggested_tec: {id: number, name: string}) => {
    setInterestTecSubstring("");
    setSuggestedInterestTecs([]);
    setEditedInterests(edited_interests => new Array(...edited_interests, suggested_tec));
  }, []);
  const editedExpertisesAdd = useCallback((suggested_tec: {id: number, name: string}) => {
    setExpertiseTecSubstring("");
    setSuggestedExpertiseTecs([]);
    setEditedExpertises(edited_expertises => new Array(...edited_expertises, {...suggested_tec, years: 1}));
  }, []);
  const editedExperiencesAdd = useCallback((suggested_tec: {id: number, name: string}) => {
    setExperienceTecSubstring("");
    setSuggestedExperienceTecs([]);
    setEditedExperiences(edited_experiences => new Array(...edited_experiences, {...suggested_tec, years: 1}));
  }, []);

  // 編集中にタグを削除する処理
  const editedInterestsErase = useCallback((target_index: number) => {
    setEditedInterests(edited_interests => edited_interests.filter((_, index) => (target_index !== index)));
  }, []);
  const editedExpertisesErase = useCallback((target_index: number) => {
    setEditedExpertises(edited_expertises => edited_expertises.filter((_, index) => (target_index !== index)));
  }, []);
  const editedExperiencesErase = useCallback((target_index: number) => {
    setEditedExperiences(edited_experiences => edited_experiences.filter((_, index) => (target_index !== index)));
  }, []);

  // 編集中にタグに対する年数を変更する処理
  const editedExpertisesYearsChange = useCallback((target_index: number, new_years: number) => {
    setEditedExpertises(edited_expertises => edited_expertises.map((expertise, index) => {
      if(target_index === index) return {...expertise, years: new_years};
      return expertise;
    }));
  }, []);
  const editedExperiencesYearsChange = useCallback((target_index: number, new_years: number) => {
    setEditedExperiences(edited_experiences => edited_experiences.map((experience, index) => {
      if(target_index === index) return {...experience, years: new_years};
      return experience;
    }));
  }, []);

  useEffect(() => {
    // プロフィール情報を取得する
    axios.get('http://localhost:8000/get-profile/' + user_id)
    .then((res) => {
      const get_profile_res: GetProfileResponse = res.data;
      console.log(get_profile_res);
      setName(get_profile_res.name);
      setSnsLink(get_profile_res.sns_link);
      setIconUrl(get_profile_res.icon_url);
      setComment(get_profile_res.comment);
      setJoinDate(get_profile_res.join_date);
      setDepartment(get_profile_res.department);
      setInterests(get_profile_res.interests);
      setExpertises(get_profile_res.expertises);
      setExperiences(get_profile_res.experiences);
    })
    .catch((err) => {
      console.log(err);
    });
  }, [user_id]);

  return (
    <>
      <div className="container">
        <div className="d-flex">
          <div className="col-4 mt-5">
            <img
              src={icon_url}
              className="rounded-circle border border-dark"
              alt="アイコン"
            />
          </div>
          <div className="col-8">
            <div className="mt-5 mb-4 d-flex">
              <h2 className="mb-1 w-25">名前</h2>
              <h2 className="w-75 ml-5">{name}</h2>
            </div>
            <div className="mb-4 d-flex">
              <h5 className="mb-1 w-25">SNSリンク</h5>

              {is_editing ? (
                <input
                  type="text"
                  className="form-control w-75 ml-5"
                  value={edited_sns_link}
                  onChange={editedSnsLinkChange}
                />
              ) : (
                <h5 className="w-75 ml-5">{sns_link}</h5>
              )}
            </div>
            <div className="mb-4 d-flex">
              <h5 className="mb-1 w-25">ひとこと</h5>

              {is_editing ? (
                <input
                  type="text"
                  className="form-control w-75 ml-5"
                  value={edited_comment}
                  onChange={editedCommentChange}
                />
              ) : (
                <h5 className="w-75 ml-5">{comment}</h5>
              )}
            </div>
            <div className="mb-4 d-flex">
              <h5 className="w-25 mb-1">入社日</h5>

              {is_editing ? (
                <input
                  type="date"
                  className="form-control w-75 ml-5"
                  value={new Date(edited_join_date).toLocaleDateString('sv-SE')}
                  onChange={editedJoinDateChange}
                />
              ) : (
                <h5 className="w-75 ml-5">{new Date(join_date).toLocaleDateString('sv-SE')}</h5>
              )}
            </div>
            <div className="mb-4 d-flex">
              <h5 className="w-25 mb-1">所属先</h5>

              {is_editing ? (
                <input
                  type="text"
                  className="form-control w-75 ml-5"
                  value={edited_department}
                  onChange={editedDepartmentChange}
                />
              ) : (
                <h5 className="w-75 ml-5">{department}</h5>
              )}
            </div>
            <div className="mb-4 d-flex">
              <h5 className="w-25 mb-1">興味のある技術</h5>

              {is_editing ? (
                <div className="w-75">
                  {
                    edited_interests.map((interest, index) => {
                      return <div className="d-flex">
                        <h5 className="w-50 form-control">{interest.name}</h5>
                        <button className="btn btn-secondary ml-3 p-1 h6" onClick={() => {editedInterestsErase(index)}}>削除</button>
                      </div>
                    })
                  }
                  <input type="text" className="w-50 form-control" value={interest_tec_substring} onChange={interestTecSubstringChange}/>
                  {
                    suggested_interest_tecs.map(suggested_tec => {
                      return (
                        <button
                          className="btn btn-link p-0 mx-2"
                          onClick={() => {editedInterestsAdd(suggested_tec)}}
                        >
                          {suggested_tec.name}
                        </button>
                      )
                    })
                  }
                </div>
              ) : (
                <div className="d-flex flex-wrap ml-5">
                  {
                    interests.map((interest, index) => {
                      return <>
                        { index > 0 && <h5 className="">,</h5> }
                        <h5 className="">{interest.name}</h5>
                      </>
                    })
                  }
                </div>
              )}
            </div>
            <div className="mb-4 d-flex">
              <h5 className="w-25 mb-1">業務経験のある技術</h5>

              {is_editing ? (
                <div className="w-75">
                  {
                    edited_experiences.map((experience, index) => {
                      return <div className="d-flex">
                        <h1 className="w-50 form-control">{experience.name}</h1>
                        <input type="number" className="w-25 form-control ml-2" value={experience.years} onChange={(e) => {editedExperiencesYearsChange(index, parseInt(e.target.value))}}/>
                        <button className="btn btn-secondary ml-3 p-1 h6" onClick={() => {editedExperiencesErase(index)}}>削除</button>
                      </div>
                    })
                  }
                  <input type="text" className="w-50 form-control" value={experience_tec_substring} onChange={experienceTecSubstringChange}/>
                  {
                    suggested_experience_tecs.map(suggested_tec => {
                      return (
                        <button
                          className="btn btn-link p-0 mx-2"
                          onClick={() => {editedExperiencesAdd(suggested_tec)}}
                        >
                          {suggested_tec.name}
                        </button>
                      )
                    })
                  }
                </div>
              ) : (
                <div className="d-flex flex-wrap ml-5">
                  {
                    experiences.map((experience, index) => {
                      return <>
                        { index > 0 && <h5 className="mr-1">,</h5> }
                        <h5 className="">{experience.name + "(" + experience.years + "年目)"}</h5>
                      </>
                    })
                  }
                </div>
              )}
            </div>
            <div className="mb-4 d-flex">
              <h5 className="w-25 mb-1">得意な技術</h5>

              {is_editing ? (
                <div className="w-75">
                  {
                    edited_expertises.map((expertise, index) => {
                      return <div className="d-flex">
                        <h1 className="w-50 form-control">{expertise.name}</h1>
                        <input type="number" className="w-25 form-control ml-2" value={expertise.years} onChange={(e) => {editedExpertisesYearsChange(index, parseInt(e.target.value))}}/>
                        <button className="btn btn-secondary ml-3 p-1 h6" onClick={() => {editedExpertisesErase(index)}}>削除</button>
                      </div>
                    })
                  }
                  <input type="text" className="w-50 form-control" value={expertise_tec_substring} onChange={expertiseTecSubstringChange}/>
                  {
                    suggested_expertise_tecs.map(suggested_tec => {
                      return (
                        <button
                          className="btn btn-link p-0 mx-2"
                          onClick={() => {editedExpertisesAdd(suggested_tec)}}
                        >
                          {suggested_tec.name}
                        </button>
                      )
                    })
                  }
                </div>
              ) : (
                <div className="d-flex flex-wrap ml-5">
                  {
                    expertises.map((expertise, index) => {
                      return <>
                        { index > 0 && <p className="mr-1">,</p> }
                        <h5 className="">{expertise.name + "(" + expertise.years + "年目)"}</h5>
                      </>
                    })
                  }
                </div>
              )}
            </div>

            {
              user?.uid === user_id &&
              <div className="d-flex">
                { is_editing ?
                  <>
                    <button
                      className="ml-auto mr-5 mb-5 mt-4 btn btn-secondary"
                      onClick={edit_end}
                    >
                      編集やめる
                    </button>
                    <button
                      className="ml-auto mr-5 mb-5 mt-4 btn btn-primary"
                      onClick={edit_complete}
                    >
                      編集完了
                    </button>
                  </> :
                  <button
                    className="ml-auto mr-5 mb-5 mt-4 btn btn-primary"
                    onClick={edit_start}
                  >
                    編集
                  </button>
                }
              </div>
            }
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;
