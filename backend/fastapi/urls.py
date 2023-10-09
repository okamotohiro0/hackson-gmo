from controllers import *

# FastAPIのルーティング用関数
app.add_api_route("/", index)

# データの受け渡しできるかテスト
app.add_api_route("/data", get_data)

# # プロフィールの表示
# app.add_api_route('/get-profile',get_profile)


# 技術検索結果取得リクエスト
app.add_api_route("/search-tec/{tec_id}", get_tec_result)



# 技術サジェスト取得リクエスト
app.add_api_route("/get-suggested-tecs/{tec_substring}", get_suggested_tecs)



# プロフィール情報取得リクエスト
app.add_api_route("/get-profile/{user_id}", get_user_profile)


# 指定のuser_idを持つユーザテーブルを取得するリクエスト
app.add_api_route("/users/{user_id}", get_user_by_id, methods=["GET"])

# ユーザーテーブルを追加するリクエスト
app.add_api_route("/users/", create_user, methods=["POST"])

# ユーザテーブルを全取得するリクエスト
app.add_api_route("/users/", get_all_users, methods=["GET"])


# 特定のユーザーのプロフィール情報を取得するリクエスト
app.add_api_route("/get-profile/{user_id}", get_user_profile, methods=["GET"])

# 特定のユーザーのプロフィール情報を編集するリクエスト
app.add_api_route('/update-profile/', update_user_profile, methods=['POST'])

# 勉強会参加したいリクエスト（いいね機能）
app.add_api_route('/update-like/', update_like, methods=['POST'])

# 勉強会やっぱり参加したくないリクエスト（いいね取り消し機能）
app.add_api_route('/update-not-like/', update_not_like, methods=['POST'])

# タイムラインの更新リクエスト
app.add_api_route('/update-timeline', timeline , methods=['GET'])

# トレンド技術取得リクエスト
app.add_api_route('/get-trend-tec', get_trend , methods=['GET'])

# 技術人検索リクエスト
app.add_api_route('/tec-search/{tec_id}', get_tech_users , methods=['GET'])


app.add_api_route('/tec-post', post_tech , methods=['POST'])
