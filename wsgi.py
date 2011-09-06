import sys
import os
os.environ['WWW_SETTINGS'] = 'settings/production.py'
sys.path.append('/home/dotcloud/current')
from www import app as application
