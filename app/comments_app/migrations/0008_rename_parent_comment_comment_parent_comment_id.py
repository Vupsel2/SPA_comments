# Generated by Django 5.0.3 on 2024-05-17 16:00

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('comments_app', '0007_rename_child_comment_comment_parent_comment'),
    ]

    operations = [
        migrations.RenameField(
            model_name='comment',
            old_name='parent_comment',
            new_name='parent_comment_id',
        ),
    ]