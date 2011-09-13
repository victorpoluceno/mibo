from flask import Flask
from flaskext.assets import Environment, Bundle

app = Flask(__name__)
app.config.from_object('www.settings.default')
app.config.from_envvar('WWW_SETTINGS', silent=True)

assets = Environment(app)

import www.views

