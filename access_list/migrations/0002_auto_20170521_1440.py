# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2017-05-21 11:40
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('access_list', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='accesslist',
            name='number',
            field=models.CharField(max_length=255, unique=True),
        ),
    ]
