# Generated by Django 5.0.3 on 2024-05-20 16:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('comments_app', '0013_comment_image_comment_text_file'),
    ]

    operations = [
        migrations.AlterField(
            model_name='comment',
            name='image',
            field=models.ImageField(blank=True, null=True, upload_to='media/images/'),
        ),
        migrations.AlterField(
            model_name='comment',
            name='text_file',
            field=models.FileField(blank=True, null=True, upload_to='media/text_files/'),
        ),
    ]