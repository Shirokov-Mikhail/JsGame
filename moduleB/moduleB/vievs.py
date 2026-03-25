from django.shortcuts import render, redirect

def index(request):
    data = {}
    return render('../static/..', context=data)

