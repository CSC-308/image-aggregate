from setuptools import setup

setup(
    name='api',
    packages=['api'],
    include_package_data=True,
    install_requires=[
        'flask',
        'flask-cors',
        'flask-login',
        'requests',
        'pyopenssl',
        'oauthlib',
    ],
)
