# Easy Admin Drag 'n Drop Sort
This bundle aims to add drag 'n drop sorting to Easy Admin list views, utilizing the sortable doctrine extensions.

**PLEASE NOTE** This is still under developement, so use at your own risk.

## Getting Started
### Installation
Because this bundle is still under development and yet lacks testing, it is not on Packagist at this time, so you'll need to add the repository to your composer.json file:
```
// composer.json
{
"repositories": [
        {
            "url": "https://github.com/treetop1500/easyadmin-dragndrop-sort.git",
            "type": "git"
        }
    ]
}
```

Next install the bundle via composer:

```
composer require treetop1500/easyadmin-dragndrop-sort
```

Install Assets
```
bin/console assets:install --symlink
```

### Configure Gedmo Extensions
You'll need to set up the [Gedmo Doctrine Extension](https://github.com/Atlantic18/DoctrineExtensions/blob/master/doc/symfony2.md) for Sortable.

### Add Routing
```
easyadmin_dragndrop_sort:
  resource: "@Treetop1500EasyadminDragndropSortBundle/Controller"
  type:     annotation
  prefix: /manage
```

### Javascript and CSS
Ensure that the JS and CSS files are inlcuded in your template via your EasyAdmin Config:
```
//config/packages/easy_admin.yml
easy_admin:
  design:
    assets:
      css:
        - '/bundles/treetop1500easyadmindragndropsort/stylesheets/easyadmin-dragndrop-sort.css'
      js:
        - '/public/bundles/treetop1500easyadmindragndropsort/stylesheets/easyadmin-dragndrop-sort.css'
```
...or better yet, compile them into your JS and CSS using webpack or another package manager.
```
// assets/js/app-admin.js
require('../../public/bundles/treetop1500easyadmindragndropsort/stylesheets/easyadmin-dragndrop-sort.css');
require('../../public/bundles/treetop1500easyadmindragndropsort/javascripts/easyadmin-dragndrop-sort.js');
```

### Configure your Entities
All entities should have a `$position` property which is used as the primary sort method.  This property is annotated as a Gedmo SortablePosition property.
```
<?php
namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation as Gedmo;

class Page
{
    ...

    /**
     * @var integer $position
     *
     * @Gedmo\SortablePosition()
     * @ORM\Column(name="position", type="integer")
     */
    private $position;

    /**
     * @return int
     */
    public function getPosition(): ?int
    {
        return $this->position;
    }
    /**
     * @param int $position
     */
    public function setPosition(?int $position)
    {
        $this->position = $position;
    }
}
```

### Undo list view sorting in Easy Admin Bundle
Because this method utilizes list position in the table to determine the new sort when dropped, you need to disable column head sorting or things get weird. Easy Admin does not include a way to globally turn this off, however you can disable sorting per column by setting `sortable: false` on each property of the list view:
```
easy_admin:
  ...
  entities:
    Page:
      ..
      list:
        fields:
          - { property: 'position', sortable: false }
          - { property: 'active', sortable: false  }
          - { property: 'ID', label: 'ID', sortable: false  }
          - { property: 'title', sortable: false  }
          - { property: 'slug', sortable: false  }

```


#### To Do
- Set up a flex recipe that will automatically configure the bundle, add routes, add to the kernel and install assets.
- Extend the configuration to be able to specify which Entity's list views have this functionality.
- Explore better integration into the Easy Admin bundle by way of extension.
- Make the admin prefix more dynamic (currently set to "manage")
- Make the fully qualified class name in the JS more dynamic (currently "App\Entity\{Entity}")
- Test with mobile views
- Integrate testing
- Docs
