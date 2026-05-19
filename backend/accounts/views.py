# accounts/views.py (Ya jahan bhi login logic hai)
from django.contrib.auth import authenticate

def login_view(request):
    # Data lene ka tarika (Agar API hai toh request.data, normal form hai toh request.POST)
    email = request.data.get('email') 
    password = request.data.get('password')

    # DHAYAN DEIN: Django internally 'username' keyword hi use karta hai 
    # USERNAME_FIELD ki wajah se. Isliye ye try karein:
    user = authenticate(request, username=email, password=password)

    if user is not None:
        # Success! Login the user
        print("Login Successful")
    else:
        # Yahan fail ho raha hai
        print("Auth failed: User inactive or wrong credentials")
    # accounts/views.py mein jahan 'print' likha hai, wahan ye karein:
send_mail(
    'Your OTP Code',
    f'Your OTP for registration is: {otp}',
    'from@example.com',
    [email],
    fail_silently=False,
)