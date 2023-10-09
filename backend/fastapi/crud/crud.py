from migration import models
from schemas import schemas
from sqlalchemy.orm import Session

"""from ..migration import models
from ..schemas import schemas"""


# For Users
def get_user(db: Session, user_id: int):
    return db.query(models.Users).filter(models.Users.id == user_id).first()


# def create_user(db: Session, user: schemas.UsersCreate):
#     db_user = models.Users(**user.dict())
#     db.add(db_user)
#     db.commit()
#     db.refresh(db_user)
#     return db_user


# For UserActive
def get_user_active(db: Session, user_id: int):
    return (
        db.query(models.UserActive).filter(models.UserActive.user_id == user_id).first()
    )


def create_user_active(db: Session, user_active: schemas.UserActiveCreate):
    db_user_active = models.UserActive(**user_active.dict())
    db.add(db_user_active)
    db.commit()
    db.refresh(db_user_active)
    return db_user_active


def get_all_users(db: Session):
    users = db.query(models.Users).all()
    return users


# For UserLeave
def get_user_leave(db: Session, user_id: int):
    return (
        db.query(models.UserLeave).filter(models.UserLeave.user_id == user_id).first()
    )


def create_user_leave(db: Session, user_leave: schemas.UserLeaveCreate):
    db_user_leave = models.UserLeave(**user_leave.dict())
    db.add(db_user_leave)
    db.commit()
    db.refresh(db_user_leave)
    return db_user_leave


# For UserDetail
def get_user_detail(db: Session, user_id: int):
    return (
        db.query(models.UserDetail).filter(models.UserDetail.user_id == user_id).first()
    )


def create_user_detail(db: Session, user_detail: schemas.UserDetailCreate):
    db_user_detail = models.UserDetail(**user_detail.dict())
    db.add(db_user_detail)
    db.commit()
    db.refresh(db_user_detail)
    return db_user_detail


# For Technologies
def get_technology(db: Session, tech_id: int):
    return (
        db.query(models.Technologies).filter(models.Technologies.id == tech_id).first()
    )


def create_technology(db: Session, technology: schemas.TechnologiesCreate):
    db_technology = models.Technologies(**technology.dict())
    db.add(db_technology)
    db.commit()
    db.refresh(db_technology)
    return db_technology


# For UserExperiences
def get_user_experience(db: Session, experience_id: int):
    return (
        db.query(models.UserExperiences)
        .filter(models.UserExperiences.id == experience_id)
        .first()
    )


def create_user_experience(db: Session, user_experience: schemas.UserExperiencesCreate):
    db_user_experience = models.UserExperiences(**user_experience.dict())
    db.add(db_user_experience)
    db.commit()
    db.refresh(db_user_experience)
    return db_user_experience


# For UserExpertises
def get_user_expertise(db: Session, expertise_id: int):
    return (
        db.query(models.UserExpertises)
        .filter(models.UserExpertises.id == expertise_id)
        .first()
    )


def create_user_expertise(db: Session, user_expertise: schemas.UserExpertisesCreate):
    db_user_expertise = models.UserExpertises(**user_expertise.dict())
    db.add(db_user_expertise)
    db.commit()
    db.refresh(db_user_expertise)
    return db_user_expertise


# For UserInterests
def get_user_interest(db: Session, interest_id: int):
    return (
        db.query(models.UserInterests)
        .filter(models.UserInterests.id == interest_id)
        .first()
    )


def create_user_interest(db: Session, user_interest: schemas.UserInterestsCreate):
    db_user_interest = models.UserInterests(**user_interest.dict())
    db.add(db_user_interest)
    db.commit()
    db.refresh(db_user_interest)
    return db_user_interest


# For StudySessions
def get_study_session(db: Session, session_id: int):
    return (
        db.query(models.StudySessions)
        .filter(models.StudySessions.id == session_id)
        .first()
    )


def create_study_session(db: Session, study_session: schemas.StudySessionsCreate):
    db_study_session = models.StudySessions(**study_session.dict())
    db.add(db_study_session)
    db.commit()
    db.refresh(db_study_session)
    return db_study_session


# For Likes
def get_like(db: Session, like_id: int):
    return db.query(models.Likes).filter(models.Likes.id == like_id).first()


def create_like(db: Session, like: schemas.LikesCreate):
    db_like = models.Likes(**like.dict())
    db.add(db_like)
    db.commit()
    db.refresh(db_like)
    return db_like


def get_user_profile(db: Session, user_id: int):
    return (
        db.query(models.UserDetail).filter(models.UserDetail.user_id == user_id).first()
    )


# ユーザの興味を更新する関数
def update_user_interest(db: Session, user_id: int, technology_id: int):
    # ユーザの興味をすべて取得
    user_interests = (
        db.query(models.UserInterests)
        .filter(models.UserInterests.user_id == user_id)
        .all()
    )

    # ユーザの興味をすべて更新
    for user_interest in user_interests:
        user_interest.technology_id = technology_id  # 技術を更新（適切な処理に置き換えてください）
        user_interest.interest_years += 1  # 興味年数を更新（適切な処理に置き換えてください）


# ユーザの専門性を更新する関数
def update_user_expertise(db: Session, user_id: int, technology_id: int, years: int):
    if technology_id:
        # ユーザの専門性を更新
        user_expertise = models.UserExpertises(
            user_id=user_id,
            technology_id=technology_id,
            expertise_years=years,
        )
        db.add(user_expertise)


# ユーザの経験を更新する関数
def update_user_experience(db: Session, user_id: int, technology_id: int, years: int):
    if technology_id:
        # ユーザの経験を更新
        user_experience = models.UserExperiences(
            user_id=user_id,
            technology_id=technology_id,
            experience_years=years,
        )
        db.add(user_experience)
