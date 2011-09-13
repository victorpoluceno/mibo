from flask import Flask, render_template, send_file
from www import app

@app.route('/')
def index():
    return render_template('index.html')


@app.route('/static/app.manifest')
def manifest():
    return send_file('static/app.manifest', mimetype='text/cache-manifest')

