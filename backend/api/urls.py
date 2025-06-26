from django.urls import path
from users import views as UserViews

urlpatterns = [
    path('register', UserViews.RegisterView.as_view()),
]

