import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import { ComposedChart, CartesianGrid, XAxis, YAxis, Bar } from "recharts";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

interface SessionSuggestionPost {
  technology: string;
  likes: number;
  date: Date;
}

interface SearchTecResponse {
  interests: { user_id: string; name: string; icon_image: string }[];
  expertises: {
    user_id: string;
    name: string;
    icon_image: string;
    expertise_years: number;
  }[];
  experiences: {
    user_id: string;
    name: string;
    icon_image: string;
    experience_years: number;
  }[];
}

interface GetTimelineResponse {
  posts: {
    session_id: number,
		date: string,
		content: string,
		likes: number,
    is_liking: boolean,
  }[]

}

export interface GetTecsResponse {
  tecs: { id: number; name: string }[];
}

function Home() {
  const navigate = useNavigate();
  const { user } = useAuthContext(); // ユーザー情報の取得


  const [posts, setPosts] = useState([] as {
    session_id: number,
		date: string,
		content: string,
		likes: number,
    is_liking: boolean,
  }[]);

  const [is_searching, setIsSearching] = useState(false);
  const [is_searched, setIsSearched] = useState(false);
  const [tec, setTec] = useState("");
  const [trend_tecs, setTrendTecs] = useState(
    [] as { id: number; name: string }[]
  );
  const [suggested_tecs, setSuggestedTecs] = useState(
    [] as { id: number; name: string }[]
  );

  const [interests, setInterests] = useState(
    [] as { user_id: string; name: string; icon_image: string }[]
  );
  const [expertises, setExpertises] = useState(
    [] as {
      user_id: string;
      name: string;
      icon_image: string;
      expertise_years: number;
    }[]
  );
  const [experiences, setExperiences] = useState(
    [] as {
      user_id: string;
      name: string;
      icon_image: string;
      experience_years: number;
    }[]
  );

  const graph_data = useCallback(() => {
    const expertise_counter = new Map<number, number>();
    const experience_counter = new Map<number, number>();

    expertises.forEach((expertise) => {
      const expertise_count = expertise_counter.get(expertise.expertise_years);
      if (expertise_count === undefined)
        expertise_counter.set(expertise.expertise_years, 1);
      else
        expertise_counter.set(expertise.expertise_years, expertise_count + 1);
    });
    experiences.forEach((experience) => {
      const experience_count = experience_counter.get(
        experience.experience_years
      );
      if (experience_count === undefined)
        experience_counter.set(experience.experience_years, 1);
      else
        experience_counter.set(
          experience.experience_years,
          experience_count + 1
        );
    });

    return [
      {
        name: "興味のある人",
        業務経験: 0,
        得意な人: 0,
        興味のある人: interests.length,
      },
      ...Array.from(experience_counter).map(([years, count]) => {
        return {
          name: "業務経験(" + years + "年目)",
          業務経験: count,
          得意な人: 0,
          興味のある人: 0,
        };
      }),
      ...Array.from(expertise_counter).map(([years, count]) => {
        return {
          name: "得意(" + years + "年目)",
          業務経験: 0,
          得意な人: count,
          興味のある人: 0,
        };
      }),
    ];
  }, [interests, expertises, experiences])();

  const search_tec = (tec: { id: number; name: string }) => {
    axios
      .get("http://localhost:8000/tec-search/" + tec.id)
      .then((res) => {
        const search_tec_res: SearchTecResponse = res.data;
        setIsSearched(true);
        setTec(tec.name);
        setInterests(search_tec_res.interests);
        setExpertises(search_tec_res.expertises);
        setExperiences(search_tec_res.experiences);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const get_suggested_tecs = (tec_substring: string) => {
    axios
      .get("http://localhost:8000/get-suggested-tecs/" + tec_substring)
      .then((res) => {
        const get_suggested_tecs_res: GetTecsResponse = res.data;
        setSuggestedTecs(get_suggested_tecs_res.tecs);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    axios
      .get("http://localhost:8000/get-trend-tec/")
      .then((res) => {
        const get_trend_tecs_res: GetTecsResponse = res.data;
        console.log(get_trend_tecs_res);
        setTrendTecs(get_trend_tecs_res.tecs);
        setSuggestedTecs(get_trend_tecs_res.tecs);
      })
      .catch((err) => {
        console.log(err);
      });

    user?.getIdToken().then((token) => {
      axios
        .get("http://localhost:8000/update-timeline/", {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        })
        .then((res) => {
          const get_timeline_res: GetTimelineResponse = res.data;
          console.log(get_timeline_res);
          setPosts(get_timeline_res.posts);
        })
        .catch((err) => {
          console.log(err);
        });
    });
  }, []);

  if (!user) {
    navigate("/login");
    return null;
  } else {
    return (
      <>
        <Modal
          show={is_searching}
          size="lg"
          onHide={() => setIsSearching(false)}
        >
          <Modal.Body>
            <div className="container">
              <div className="d-flex flex-wrap mb-2">
                <h4 className="m-auto col-3">技術検索</h4>
                <input
                  type="text"
                  className="px-3 py-2 m-0 col-9 border border-gray rounded-pill h3"
                  value={tec}
                  onChange={(e) => {
                    setTec(e.target.value);
                    if (e.target.value === "") setSuggestedTecs(trend_tecs);
                    else get_suggested_tecs(e.target.value);
                  }}
                />
              </div>
              <div className="d-flex mb-2">
                <div className="col-9 d-flex ml-auto px-2 py-2 lh-auto border border-gray rounded">
                  {suggested_tecs.map((tec) => {
                    return (
                      <button
                        className="btn btn-link p-0 mx-2"
                        onClick={() => {
                          search_tec(tec);
                        }}
                      >
                        {tec.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {is_searched && (
                <div>
                  <div className="d-flex">
                    <ComposedChart
                      width={793}
                      height={500}
                      layout="vertical"
                      data={graph_data}
                      margin={{ top: 20, right: 60, bottom: 0, left: 150 }}
                    >
                      <XAxis type="number" />
                      <YAxis type="category" dataKey="name" />

                      <CartesianGrid strokeDasharray="3 3" />
                      <Bar
                        dataKey="業務経験"
                        stackId="a"
                        barSize={20}
                        fill="#2250A2"
                      />
                      <Bar
                        dataKey="得意な人"
                        stackId="a"
                        barSize={20}
                        fill="#FF8042"
                      />
                      <Bar
                        dataKey="興味のある人"
                        stackId="a"
                        barSize={20}
                        fill="#00C49F"
                      />
                    </ComposedChart>
                  </div>

                  <h4 className="mt-4 mb-0 ml-2">業務経験のある人</h4>
                  <div className="d-flex flex-wrap">
                    {expertises.map((expertise) => {
                      return (
                        <div className="col-6 p-0">
                          <Link to={'/profile/' + expertise.user_id}>
                            <div className="m-2 p-1 border border-gray rounded d-flex">
                              <img
                                className="border border-dark rounded-circle m-1"
                                src={expertise.icon_image}
                                width={50}
                              />
                              <div className="text-dark my-auto">
                                <h4 className="m-0">{expertise.name}</h4>
                              </div>
                              <h4 className="text-dark ml-auto mr-2 my-auto">
                                {expertise.expertise_years}年目
                              </h4>
                            </div>
                          </Link>
                        </div>
                      );
                    })}
                  </div>

                  <h4 className="mt-4 mb-0 ml-2">得意な人</h4>
                  <div className="d-flex flex-wrap">
                    {experiences.map((experience) => {
                      return (
                        <div className="col-6 p-0">
                          <Link to={'/profile/' + experience.user_id}>
                            <div className="m-2 p-1 border border-gray rounded d-flex">
                              <img
                                className="border border-dark rounded-circle m-1"
                                src={experience.icon_image}
                                width={50}
                              />
                              <div className="my-auto">
                                <h4 className="text-dark m-0">{experience.name}</h4>
                              </div>
                              <h4 className="text-dark ml-auto mr-2 my-auto">
                                {experience.experience_years}年目
                              </h4>
                            </div>
                          </Link>
                        </div>
                      );
                    })}
                  </div>

                  <h4 className="mt-4 mb-0 ml-2">興味のある人</h4>
                  <div className="d-flex flex-wrap">
                    {interests.map((interest) => {
                      return (
                        <div className="col-6 p-0">
                          <Link to={'/profile/' + interest.user_id}>
                            <div className="m-2 p-1 border border-gray rounded d-flex">
                              <img
                                className="border border-dark rounded-circle m-1"
                                src={interest.icon_image}
                                width={50}
                              />
                              <div className="my-auto">
                                <h4 className="text-dark m-0">{interest.name}</h4>
                              </div>
                            </div>
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button
              className="btn btn-secondary"
              onClick={() => setIsSearching(false)}
            >
              閉じる
            </button>
          </Modal.Footer>
        </Modal>

        <div className="container">
          <div className="d-flex mt-4">
            <div className="col-8 border border-dark">
              <h4 className="text-center m-2">タイムライン</h4>
              {posts.map((post) => {
                return (
                  <div className="border-top border-dark">
                    <p className="border-bottom border-dark m-0 p-2">
                      {post.content}
                    </p>
                    <p className="border-bottom border-dark m-0 p-2">
                      {"開催日:" + post.date}
                    </p>
                    { post.is_liking ?
                      <button className="btn btn-secondary m-2" onClick={() => {
                        user?.getIdToken().then(token => {
                          axios.post("http://localhost:8000/update-not-like/", post.session_id,
                          { headers: {
                              'Content-Type': 'application/json',
                              Authorization: 'Bearer ' + token,
                            },
                          }).then((res) => {
                              setPosts(posts.map((target_post) => {
                                if(target_post.session_id === post.session_id)
                                  return {...target_post, is_liking: false, likes: target_post.likes - 1}
                                return target_post;
                              }));
                            })
                            .catch((err) => {
                              console.log(err);
                            });
                        });
                      }}>
                        やっぱ参加したくない {post.likes}
                      </button> :
                      <button className="btn btn-primary m-2" onClick={() => {
                        user?.getIdToken().then(token => {
                          axios.post('http://localhost:8000/update-like/', post.session_id,
                          { headers: {
                              'Content-Type': 'application/json',
                              Authorization: 'Bearer ' + token,
                            },
                          }).then((res) => {
                            setPosts(posts.map((target_post) => {
                              if(target_post.session_id === post.session_id)
                                return {...target_post, is_liking: true, likes: target_post.likes + 1}
                              return target_post;
                            }));
                          }).catch((err) => {
                            console.log(err);
                          });
                        });
                      }}>
                        参加したい {post.likes}
                      </button>
                    }
                  </div>
                );
              })}
            </div>
            <div className="col-4 mx-5">
              <div className="sticky-top">
                <button
                  className="btn btn-light border-dark w-100"
                  onClick={() => setIsSearching(true)}
                >
                  検索
                </button>
              </div>
              <h4 className="mt-4 text-secondary">トレンド技術</h4>
              <div className="m-2">
                {trend_tecs.map((tec) => {
                  return (
                    <button
                      className="btn btn-link"
                      onClick={() => {
                        search_tec(tec);
                        setIsSearching(true);
                      }}
                    >
                      #{tec.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default Home;
