---
title: Hexo NexT 主题使用
title-en: hexo-next-theme-demo
date: 2021-10-24 10:40:09
tags: [blog, hexo]
categories:
- Hexo
---

# 内建标签

## 文本居中的引用
此标签将生成一个带上下分割线的引用，同时引用内文本将自动居中。 文本居中时，多行文本若长度不等，视觉上会显得不对称，因此建议在引用单行文本的场景下使用。 例如作为文章开篇引用 或者 结束语之前的总结引用。
<!-- more -->
- HTML 方式：使用这种方式时，给 img 添加属性 class="blockquote-center" 即可。

```html
<!-- HTML方式: 直接在 Markdown 文件中编写 HTML 来调用 -->
<!-- 其中 class="blockquote-center" 是必须的 -->
<blockquote class="blockquote-center">blah blah blah</blockquote>
```

<blockquote class="blockquote-center">
    好雨知时节，当春乃发生。
    随风潜入夜，润物细无声。
    野径云俱黑，江船火独明。
    晓看红湿处，花重锦官城。
</blockquote>

- 标签方式：使用 centerquote 或者 简写 cq。

```html
<!-- 标签 方式，要求版本在0.4.5或以上 -->
{% centerquote %}blah blah blah{% endcenterquote %}

<!-- 标签别名 -->
{% cq %} blah blah blah {% endcq %}
```

{% cq %} 
    好雨知时节，当春乃发生。
    随风潜入夜，润物细无声。
    野径云俱黑，江船火独明。
    晓看红湿处，花重锦官城。
{% endcq %}

## 突破容器宽度限制的图片 (Error)
当使用此标签引用图片时，图片将自动扩大 26%，并突破文章容器的宽度。 此标签使用于需要突出显示的图片, 图片的扩大与容器的偏差从视觉上提升图片的吸引力。 此标签有两种调用方式（详细参看底下示例）：

- HTML方式：使用这种方式时，为 img 添加属性 class="full-image" 即可。

```html
<!-- HTML方式: 直接在 Markdown 文件中编写 HTML 来调用 -->
<!-- 其中 class="full-image" 是必须的 -->
<img src="/image-url" class="full-image" />
```

<img src="full-image.jpg" class="full-image" />

- 标签方式：使用 fullimage 或者 简写 fi， 并传递图片地址、 alt 和 title 属性即可。 属性之间以逗号分隔。

```html
<!-- 标签 方式，要求版本在0.4.5或以上 -->
{% fullimage /image-url, alt, title %}

<!-- 别名 -->
{% fi /image-url, alt, title %}
```

## Bootstrap Callout

```
{% note class_name %} Content (md partial supported) {% endnote %}
```

其中，class_name 可以是以下列表中的一个值：
- default
- primary
- success
- info
- warning
- danger

{% note default %} Content of default (md partial supported) {% endnote %}

{% note primary %} Content of primary (md partial supported) {% endnote %}

{% note success %} Content of success (md partial supported) {% endnote %}

{% note info %} Content of info (md partial supported) {% endnote %}

{% note warning %} Content of warning (md partial supported) {% endnote %}

{% note danger %} Content of danger (md partial supported) {% endnote %}

# 进阶设定




