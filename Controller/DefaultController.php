<?php

namespace Treetop1500\EasyadminDragndropSort\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Common\ContentBundle\Entity\ProductCategory;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * Class DefaultController
 * @package Treetop1500\EasyadminDragndropSort\Controller
 * @author http://github.com/treetop1500
 */
class DefaultController extends Controller
{
    /**
     * Resorts an item using it's doctrine sortable property
     *
     * @Route("/manage/sort",
     *   name="easyadmin_dragndrop_sort",
     *   requirements={
     *     "entity"="^([A-Za-z]+)$",
     *     "action"="list",
     *     "sortField"="^([A-Za-z]+)$",
     *     "sortDirection"="^(ASC|DESC)$",
     *     "page"="^(\d)$",
     *
     *   })
     * @param String $entity
     * @param String $action
     * @param Integer $page
     * @param String $sortDirection
     * @param String $sortField
     * @throws NotFoundHttpException
     * @return Response
     *
     */
    public function sortAction($id, $position)
    {
        $em = $this->getDoctrine()->getManager();
        $e = $em->getRepository($entity)->find($id);
        if (is_null($e)) {
            throw new NotFoundHttpException("The entity was not found");
        }
        $e->setPosition($position);
        $em->persist($productCategory);
        $em->flush();
        $request = new Request();
        return $this->redirectToRoute(
            "easyadmin",
            array(
                "action" => $action,
                "entity" => $entity,
                "sortField" => $sortField,
                "sortDirection" => $sortDirection,
                "page" => $page
            )
        );
    }
}
