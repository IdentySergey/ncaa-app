# -*- coding: utf-8 -*-
# Generated by Django 1.11.1 on 2017-06-01 15:11
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('access_list', '0005_auto_20170602_0102'),
    ]

    operations = [
        migrations.AlterField(
            model_name='accesslist',
            name='detected',
            field=models.DateTimeField(null=True),
        ),
    ]
