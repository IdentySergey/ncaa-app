# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2017-05-21 08:22
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='AccessList',
            fields=[
                ('created', models.CharField(auto_created=True, max_length=255)),
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('number', models.CharField(max_length=255)),
                ('mark', models.CharField(max_length=255)),
                ('ownerName', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='Detector',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('detected', models.DateTimeField(auto_now=True)),
                ('number', models.CharField(max_length=255)),
                ('photoFileName', models.CharField(max_length=255)),
            ],
        ),
    ]