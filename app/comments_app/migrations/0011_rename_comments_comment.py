# Generated by Django 5.0.3 on 2024-05-17 16:18

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('comments_app', '0010_rename_comment_comments'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='Comments',
            new_name='Comment',
        ),
    ]
