# Generated by Django 5.0.3 on 2024-05-17 15:16

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('comments_app', '0004_rename_parent_comment_comment_child_comment'),
    ]

    operations = [
        migrations.DeleteModel(
            name='Comment',
        ),
    ]
