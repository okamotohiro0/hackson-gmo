from datetime import datetime
from typing import Optional

from pydantic import BaseModel


# For Users
class UsersBase(BaseModel):
    id: str


class UsersCreate(UsersBase):
    created_at: datetime


class UsersRead(UsersBase):
    id: int


# For UserActive
class UserActiveBase(BaseModel):
    user_id: int
    created_at: datetime


class UserActiveCreate(UserActiveBase):
    pass


class UserActiveRead(UserActiveBase):
    pass


# For UserLeave
class UserLeaveBase(BaseModel):
    user_id: int
    created_at: datetime


class UserLeaveCreate(UserLeaveBase):
    pass


class UserLeaveRead(UserLeaveBase):
    pass


# For UserDetail
class UserDetailBase(BaseModel):
    user_id: int
    name: Optional[str]
    sns_link: Optional[str]
    comment: Optional[str]
    join_date: datetime
    department: Optional[str]
    icon_image: Optional[bytes]


class UserDetailCreate(UserDetailBase):
    pass


class UserDetailRead(UserDetailBase):
    pass


# For Technologies
class TechnologiesBase(BaseModel):
    name: str


class TechnologiesCreate(TechnologiesBase):
    pass


class TechnologiesRead(TechnologiesBase):
    id: int


# For UserExperiences
class UserExperiencesBase(BaseModel):
    user_id: int
    technology_id: int
    experience_years: int


class UserExperiencesCreate(UserExperiencesBase):
    pass


class UserExperiencesRead(UserExperiencesBase):
    id: int


# For UserExpertises
class UserExpertisesBase(BaseModel):
    user_id: int
    technology_id: int
    expertise_years: int


class UserExpertisesCreate(UserExpertisesBase):
    pass


class UserExpertisesRead(UserExpertisesBase):
    id: int


# For UserInterests
class UserInterestsBase(BaseModel):
    user_id: int
    technology_id: int
    interest_years: int


class UserInterestsCreate(UserInterestsBase):
    pass


class UserInterestsRead(UserInterestsBase):
    id: int


# For StudySessions
class StudySessionsBase(BaseModel):
    technology_id: int
    content: str
    date: datetime
    created_at: datetime


class StudySessionsCreate(StudySessionsBase):
    pass


class StudySessionsRead(StudySessionsBase):
    id: int


# For Likes
class LikesBase(BaseModel):
    user_id: int
    study_session_id: int


class LikesCreate(LikesBase):
    pass


class LikesRead(LikesBase):
    id: int
